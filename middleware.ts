import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { COOKIE_NAME } from '@/lib/auth'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production-please-use-a-long-random-string'
)

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']
const API_PUBLIC = ['/api/auth/login', '/api/auth/logout', '/api/auth/register', '/api/seed']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public API routes
  if (API_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get(COOKIE_NAME)?.value

  // Authenticated users trying to access auth pages → redirect to dashboard
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret)
        const role = payload.role as string
        const dest =
          role === 'admin' ? '/dashboard/admin'
          : role === 'mjek' ? '/dashboard/mjek'
          : '/dashboard/recepsion'
        return NextResponse.redirect(new URL(dest, req.url))
      } catch {
        // Invalid token — let them see the auth page
      }
    }
    return NextResponse.next()
  }

  // Protected routes (dashboard + api)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', req.url))
    }

    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Token i pavlefshëm.' }, { status: 401 })
      }
      const res = NextResponse.redirect(new URL('/login', req.url))
      res.cookies.delete(COOKIE_NAME)
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
