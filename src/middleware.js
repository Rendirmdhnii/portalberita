import { NextResponse } from 'next/server';

export function middleware(request, event) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Canonical Domain Shield: Cegah akses via URL bawaan Vercel
  if (hostname.includes('.vercel.app')) {
    const canonicalUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://pojoktv.com');
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // Define static files and routes that must be excluded from logging to avoid cluttering and infinite loops
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api/') || // Exclude API routes to prevent infinite loops
    pathname.includes('.') // Exclude general file extensions (e.g. .png, .jpg, .ico, .txt, .xml)
  ) {
    return NextResponse.next();
  }

  // Extract Vercel Edge Headers
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
  const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown';
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const visitedUrl = request.nextUrl.pathname + request.nextUrl.search;

  const logPayload = {
    ip_address: ip,
    city: decodeURIComponent(city),
    region: decodeURIComponent(region),
    country,
    user_agent: userAgent,
    visited_url: visitedUrl,
  };

  // Perform background HTTP request to the log handler API using NextFetchEvent.waitUntil
  // This is highly optimal as it does not block response streaming/page loading for visitors
  event.waitUntil(
    fetch(new URL('/api/log-visitor', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-middleware-secret': process.env.MIDDLEWARE_SECRET || 'fallback-secret-key-123',
      },
      body: JSON.stringify(logPayload),
    })
    .then((res) => {
      if (!res.ok) {
        console.error('Failed to log visitor in API route. Status:', res.status);
      }
    })
    .catch((err) => {
      console.error('Error logging visitor via background fetch:', err);
    })
  );

  return NextResponse.next();
}

export const config = {
  // Catch all page requests
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap|images/).*)'],
};
