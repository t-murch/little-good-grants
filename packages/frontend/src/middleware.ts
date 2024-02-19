import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from './app/utils/amplifyServerUtils';

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL ?? '',
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN ?? '',
  }),
  limiter: Ratelimit.fixedWindow(2, '10 s'),
});

const RATE_LIMIT_RESPONSE = NextResponse.json(
  { success: false, message: 'Rate limit exceeded. Try again later' },
  { status: 429 },
);

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const ip = request.ip ?? '127.0.0.1';

  if (request.nextUrl.pathname.startsWith('/api/grants')) {
    try {
      const { success, pending, limit, reset, remaining } =
        await ratelimit.limit(`lggrants_${ip}`);
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

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next();

    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          return session.tokens !== undefined;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    });

    if (!authenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
    // return NextResponse.redirect(new URL('/login', request.url));
    // // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    // // const res = NextResponse.next()
    // let response = NextResponse.next({
    //   request: {
    //     headers: request.headers,
    //   },
    // });
    //
    // const credentials = await fetchAuthSession();
    // console.log('credentials', JSON.stringify(credentials, null, 2));
    //
    // if (!credentials) {
    //   // Auth condition not met, redirect to home page.
    //   const redirectUrl = request.nextUrl.clone();
    //   redirectUrl.pathname = '/login';
    //   redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname);
    //   return NextResponse.redirect(redirectUrl);
    // }
    //
    // return response;
  }
}

export const config = {
  matcher: ['/api/grants', '/admin'],
};
