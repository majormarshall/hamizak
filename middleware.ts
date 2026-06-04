import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ── In-memory maintenance mode cache (60s TTL) ────────────────────────────────
// Middleware runs on every request, so we cache the DB result to avoid
// a Supabase round-trip on each page load (which causes 504 timeouts on Vercel).
let maintenanceCache: { value: boolean; expiresAt: number } | null = null

async function getMaintenanceMode(): Promise<boolean> {
  const now = Date.now()
  if (maintenanceCache && now < maintenanceCache.expiresAt) {
    return maintenanceCache.value
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await adminSupabase
    .from('site_settings')
    .select('maintenance_mode')
    .eq('id', 1)
    .single()

  const value = data?.maintenance_mode === true
  maintenanceCache = { value, expiresAt: now + 60_000 } // cache for 60 seconds
  return value
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const path = request.nextUrl.pathname

  // ── Maintenance Mode ──────────────────────────────────────────────────────
  // Only applies to public-facing pages (not admin, login, maintenance, assets)
  const isPublicRoute =
    !path.startsWith('/admin') &&
    !path.startsWith('/login') &&
    !path.startsWith('/maintenance') &&
    !path.startsWith('/_next') &&
    !path.startsWith('/api') &&
    !path.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?)$/)

  if (isPublicRoute) {
    const inMaintenance = await getMaintenanceMode()
    if (inMaintenance) {
      const url = request.nextUrl.clone()
      url.pathname = '/maintenance'
      return NextResponse.redirect(url)
    }
    // Public route, not in maintenance — no need to check auth
    return response
  }

  // ── Auth check (only needed for /admin and /login routes) ─────────────────
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

  // ── Protect all /admin routes ─────────────────────────────────────────────
  if (path.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: isAdmin } = await adminSupabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .single()

    const HARDCODED_ADMINS = ['kalibest10@gmail.com', 'hussainyusuf393@gmail.com']
    if (!isAdmin && !HARDCODED_ADMINS.includes(user.email ?? '')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'unauthorized')
      await supabase.auth.signOut()
      return NextResponse.redirect(url)
    }
  }

  // ── Redirect logged-in users away from /login ─────────────────────────────
  if (path === '/login' && user) {
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
