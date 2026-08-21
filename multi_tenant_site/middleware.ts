import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 避免拦截 Next.js 内部静态资源、API 和图标
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 提取纯粹的子域名 (如 bakery.sites.tubban.com -> bakery)
  let currentHost = hostname
    .replace(`.sites.tubban.com`, '')
    .replace(`.tubban.com`, '')
    .replace(`.vercel.app`, '')
    .replace(`:3000`, '')
    .replace(`localhost`, '');

  // 如果访问的是主域名 sites.tubban.com 或 admin 子域名，或者路径包含 /admin
  const isRootDomain = currentHost === 'sites' || currentHost === 'multitenantsite-lac' || currentHost === '' || currentHost === hostname;
  
  if (currentHost === 'admin' || isRootDomain || url.pathname.startsWith('/admin')) {
    if (url.pathname === '/' || url.pathname === '/admin') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 普通多租户动态重定向到 app/[domain]
  url.pathname = `/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

