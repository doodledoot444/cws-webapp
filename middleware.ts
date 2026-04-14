import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getRequiredOneOfEnv } from '@/lib/env';

const authSecret = getRequiredOneOfEnv(['NEXTAUTH_SECRET', 'AUTH_SECRET'], 'middleware token validation');

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: authSecret,
  });

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/order/:path*', '/profile/:path*', '/admin/:path*'],
};
