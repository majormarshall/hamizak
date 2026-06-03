import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  const { data: { user } } = await supabase.auth.getUser()

  // ── Protect /admin routes ─────────────────────────────────────────────────
  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Hardcoded super-admins bypass the DB lookup (saves a round-trip)
    const SUPER_ADMINS = ['kalibest10@gmail.com', 'hussainyusuf393@gmail.com']
    if (!SUPER_ADMINS.includes(user.email ?? '')) {
      // Only hit the DB for non-super-admins
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data: isAdmin } = await adminSupabase
        .from('admins')
        .select('email')
        .eq('email', user.email)
        .single()

      if (!isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'unauthorized')
        await supabase.auth.signOut()
        return NextResponse.redirect(url)
      }
    }
  }

  // ── Redirect already-logged-in users away from /login ─────────────────────
  if (isLoginPage && user) {
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
