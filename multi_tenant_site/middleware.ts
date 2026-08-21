import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // 1. 静态资源与 API 放行
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. 提取子域名
  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.hostname || '';
  const hostname = rawHost.split(':')[0];

  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 3. 平台总系统后台处理 (只针对主域名 sites / admin 或根路径)
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname === 'localhost' || hostname === '127.0.0.1') {
    if (url.pathname === '/admin' || url.pathname === '/admin/dashboard') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. 关键：商户专属子域名的 /admin 显式重写映射至 /admin/merchant
  if (url.pathname === '/admin' || url.pathname === '/admin/') {
    url.pathname = '/admin/merchant';
    url.searchParams.set('domain', subdomain);
    return NextResponse.rewrite(url);
  }

  // 5. 其他内部已路由路径放行
  if (url.pathname.startsWith('/admin/merchant') || url.pathname.startsWith('/site/')) {
    return NextResponse.next();
  }

  // 6. 默认根路径与常规页面映射至 /site/[subdomain]
  url.pathname = `/site/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
