import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // 1. 静态资源与内部 API 放行
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. 抓取 Host
  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.hostname || '';
  const hostname = rawHost.split(':')[0];

  // 3. 提取子域名前缀
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 4. 平台总管理控制台处理 (如 admin.tubban.com 或主站 /admin)
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname === 'localhost' || hostname === '127.0.0.1') {
    if (url.pathname === '/admin' || url.pathname === '/') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 5. 商户子域名映射处理 (如 backerei-muller.tubban.com)
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    // 映射到 /site/[domain]/admin
    url.pathname = `/site/${subdomain}/admin`;
    return NextResponse.rewrite(url);
  }

  // 默认根路径映射到 /site/[domain]
  if (url.pathname === '/' || !url.pathname.startsWith('/site/')) {
    url.pathname = `/site/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
