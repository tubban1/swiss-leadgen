import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 提取子域名
  const currentHost = hostname
    .replace(`.sites.tubban.com`, '')
    .replace(`.tubban.com`, '')
    .replace(`:3000`, '')
    .replace(`localhost`, '');

  // 如果访问的是 /admin/dashboard 或子域名为 admin/dashboard，指向超级管理员 CRM 界面
  if (currentHost === 'admin' || url.pathname.startsWith('/admin/dashboard') || url.pathname.startsWith('/api/admin')) {
    if (url.pathname === '/' && currentHost === 'admin') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 普通多租户重定向到 app/[domain] 路由
  url.pathname = `/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
