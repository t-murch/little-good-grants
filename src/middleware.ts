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

  // if (request.nextUrl.pathname.startsWith('/admin')) {

  // }
}

export const config = {
  matcher: '/api/grants',
};
