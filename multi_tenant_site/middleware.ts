import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. 静态资源、内部 API 放行
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. 提取真正的子域名前缀
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 3. 如果没有子域名或子域名为主站点/Admin 接口
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname.includes('vercel.app')) {
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. 多租户子域名动态重定向至 /app/[domain]
  const cleanPath = url.pathname === '/' ? '' : url.pathname;
  url.pathname = `/${subdomain}${cleanPath}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
