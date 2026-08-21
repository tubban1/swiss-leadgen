import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || req.nextUrl.hostname || '';

  console.log(`[Middleware Check] Hostname: ${hostname} | Path: ${url.pathname}`);

  // 1. 静态资源、内部 API 路由放行
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. 提取子域名前缀 (如 cafe-bellevue.sites.tubban.com -> cafe-bellevue)
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 3. 主站 / Admin 后台无缝放行
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname.includes('vercel.app')) {
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. 将子域名无缝重写映射至 /site/[domain] 动态页面
  const cleanPath = url.pathname === '/' ? '' : url.pathname;
  url.pathname = `/site/${subdomain}${cleanPath}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
