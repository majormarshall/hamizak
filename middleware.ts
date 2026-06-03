import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware — edge runtime, ZERO DB calls, ZERO network calls.
 *
 * - Public routes  → pass through instantly (no checks)
 * - /admin routes  → getSession() from cookie (local decode, no network)
 * - /login page    → redirect logged-in users to /admin
 *
 * Maintenance mode  → app/(public)/layout.tsx (Node.js server component)
 * Admin auth check  → app/admin/layout.tsx     (Node.js server component)
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const { pathname } = request.nextUrl

  // Skip entirely for static assets, API, auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/maintenance') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?|txt|xml|map)$/)
  ) {
    return response
  }

  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage  = pathname === '/login'

  // Public routes — zero checks, instant pass-through
  if (!isAdminRoute && !isLoginPage) {
    return response
  }

  // Auth check for /admin and /login only
  // getSession() reads JWT from cookie locally — NO network call
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
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

  if (isAdminRoute && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isLoginPage && session) {
    if (request.nextUrl.searchParams.get('error') === 'unauthorized') return response
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
