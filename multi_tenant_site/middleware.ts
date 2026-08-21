import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // 1. 优先抓取 Edge Proxy 的 x-forwarded-host
  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.hostname || '';
  const hostname = rawHost.split(':')[0];

  // 2. 静态资源、内部 API、已重写的 /site 路径放行
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/site') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 3. 精准提取子域名前缀 (如 cafe-bellevue.sites.tubban.com -> cafe-bellevue)
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 4. 仅当没有任何子域名、或子域名为 sites / admin 时判定为主站控制台
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin') {
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 5. 任何动态子域名均正确映射重写至 /site/[domain] 页面
  const cleanPath = url.pathname === '/' ? '' : url.pathname;
  url.pathname = `/site/${subdomain}${cleanPath}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
