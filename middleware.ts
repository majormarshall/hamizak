import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware — edge runtime, ZERO DB calls, ZERO network calls.
 *
 * Responsibilities:
 *  1. Skip immediately for static assets, API, auth routes
 *  2. Public routes  → pass through instantly (no checks)
 *  3. /admin routes  → check session from cookie (local JWT decode, no network)
 *                      → redirect to /login if no session
 *                      → admin email authorization runs in admin/layout.tsx (Node.js)
 *  4. /login page    → redirect already-logged-in users to /admin
 *
 * Maintenance mode  → handled in app/(public)/layout.tsx (server component, Node.js)
 * Admin auth check  → handled in app/admin/layout.tsx     (server component, Node.js)
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const { pathname } = request.nextUrl

  // ── 1. Skip — static assets, API, auth callback, maintenance page ──────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/maintenance') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?|txt|xml|map)$/)
  ) {
    return response
  }

  // ── 2. Public routes — zero checks needed ────────────────────────────────
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage  = pathname === '/login'

  if (!isAdminRoute && !isLoginPage) {
    return response  // public pages pass through instantly
  }

  // ── 3 & 4. Auth check for /admin and /login only ─────────────────────────
  // createServerClient is needed to keep the Supabase session cookie refreshed.
  // getSession() decodes the JWT from the cookie — NO network round-trip.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // ── /admin: redirect to login if no session ──────────────────────────────
  if (isAdminRoute && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ── /login: redirect to admin if already logged in ───────────────────────
  if (isLoginPage && session) {
    // Allow landing on /login?error=unauthorized even if logged in
    if (request.nextUrl.searchParams.get('error') === 'unauthorized') {
      return response
    }
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
