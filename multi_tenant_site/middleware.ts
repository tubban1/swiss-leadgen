import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // 核心：优先从 Vercel Edge 网关的 x-forwarded-host 抓取真实的通配符子域名
  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.hostname || '';
  const hostname = rawHost.split(':')[0]; // 清除可能包含的端口号

  // 1. 静态资源、API、已重写的 site 路径豁免
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/site') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. 精准提取子域名前缀 (如 cafe-bellevue.sites.tubban.com -> cafe-bellevue)
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 3. 根站点 / Admin 后台无缝路由
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname.includes('vercel.app')) {
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. 重写映射至 /site/[domain] 动态多租户页面
  const cleanPath = url.pathname === '/' ? '' : url.pathname;
  url.pathname = `/site/${subdomain}${cleanPath}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
