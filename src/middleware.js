import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Canonical Domain Shield: Cegah akses via URL bawaan Vercel
  if (hostname.includes('.vercel.app')) {
    const canonicalUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://pojoktv.com');
    return NextResponse.redirect(canonicalUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap|images/).*)'],
};
