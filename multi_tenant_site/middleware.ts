import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 替换根域名获取子域名 (例如: bakerei-muller.tubban.com -> bakerei-muller)
  const currentHost = hostname.replace(`.tubban.com`, '').replace(`:3000`, '');

  // 内部重定向到 app/[domain] 路由
  url.pathname = `/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
