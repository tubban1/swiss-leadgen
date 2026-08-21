import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. 静态资源、API 放行
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. 提取子域名前缀
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 3. 主站/Admin 后台逻辑
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname.includes('vercel.app')) {
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. 重写至 Next.js 动态多租户路径 /site/[domain]
  const cleanPath = url.pathname === '/' ? '' : url.pathname;
  url.pathname = `/site/${subdomain}${cleanPath}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
