import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const path = request.nextUrl.pathname

  // ── Skip middleware entirely for static assets & auth callback ────────────
  // These never need auth or maintenance checks
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/auth') ||
    path.startsWith('/maintenance') ||
    path.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?|txt|xml)$/)
  ) {
    return response
  }

  // ── Public routes: no DB calls at all ────────────────────────────────────
  // Maintenance mode is handled inside the public page (server component),
  // which avoids a Supabase round-trip on every middleware invocation.
  const isAdminRoute = path.startsWith('/admin')
  const isLoginPage  = path === '/login'

  if (!isAdminRoute && !isLoginPage) {
    return response
  }

  // ── Auth check (only /admin and /login routes reach here) ─────────────────
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

  // Use getSession() — reads JWT from cookie locally, NO network call (avoids 504 timeout)
  // Admin page server components re-verify with getUser() for full security
  const { data: { session } } = await supabase.auth.getSession()
  const userEmail = session?.user?.email ?? null

  // ── Protect /admin routes ─────────────────────────────────────────────────
  if (isAdminRoute) {
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // All admin email checking is deferred to the admin layout server component
    // where it runs in Node.js runtime (no timeout constraints)
  }

  // ── Redirect already-logged-in users away from /login ─────────────────────
  if (isLoginPage && session) {
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
