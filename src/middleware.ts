import { CookieOptions, createServerClient } from '@supabase/ssr';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(2, '10 s'),
});

const RATE_LIMIT_RESPONSE = NextResponse.json({ success: false, message: 'Rate limit exceeded. Try again later' }, { status: 429 });

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const ip = request.ip ?? '127.0.0.1';

  if (request.nextUrl.pathname.startsWith('/api/grants')) {
    try {
      const { success, pending, limit, reset, remaining } = await ratelimit.limit(`lggrants_${ip}`);
      event.waitUntil(pending);
      console.log('success?', success);

      const res = success ? NextResponse.next() : RATE_LIMIT_RESPONSE;

      res.headers.set('X-RateLimit-Limit', limit.toString());
      res.headers.set('X-RateLimit-Remaining', remaining.toString());
      res.headers.set('X-RateLimit-Reset', reset.toString());
      // return request;
      return res;
    } catch (error) {
      console.error('Error updating rate limit on Submission. Error= ', error);
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith('/home/admin')) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    // const res = NextResponse.next()
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    // Create authenticated Supabase Client.
    // const supabase = createMiddlewareClient({ req, res })
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    });
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.debug('session=', session);
    // Check auth condition
    if (session) {
      // if (session?.user.email?.endsWith('@gmail.com')) {
      // Authentication successful, forward request to protected route.
      return response;
    }

    // Auth condition not met, redirect to home page.
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/home/login';
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/api/grants', '/home/admin'],
};
