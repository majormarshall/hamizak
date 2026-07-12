import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

/* ── Valid member slugs → stable filenames in Supabase Storage ── */
const VALID_SLUGS = new Set([
  'dr-maryam',
  'alh-bello',
  'hajia-habeebah',
  'amina-ladidi',
  'zainab-okunola',
])

const BUCKET = 'board-photos'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const member   = (formData.get('member') as string | null)?.trim()
    const file     = formData.get('file') as File | null

    // ── Validation ─────────────────────────────────────────────
    if (!member || !VALID_SLUGS.has(member)) {
      return NextResponse.json(
        { error: `Unknown member slug "${member}". Valid: ${[...VALID_SLUGS].join(', ')}` },
        { status: 400 }
      )
    }
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, or WebP images are accepted.' },
        { status: 400 }
      )
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 10 MB.' }, { status: 400 })
    }

    // ── Supabase admin client (service role bypasses RLS) ──────
    const url    = process.env.NEXT_PUBLIC_SUPABASE_URL
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !svcKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(url, svcKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // ── Upload to Supabase Storage ─────────────────────────────
    // Always store as {slug}.jpg for a predictable, overridable path.
    // upsert: true → replaces the existing file.
    const storagePath = `${member}.jpg`
    const buffer      = Buffer.from(await file.arrayBuffer())

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType:  'image/jpeg',   // force jpeg mime regardless of source format
        cacheControl: '3600',
        upsert:       true,
      })

    if (uploadErr) {
      console.error('❌ Storage upload error:', uploadErr.message)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 })
    }

    // ── Build the public URL ────────────────────────────────────
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
    const imageUrl = urlData.publicUrl

    // ── Persist URL in board_photos table ──────────────────────
    // Using upsert so first upload creates the row, subsequent ones update it.
    const { error: dbErr } = await supabase
      .from('board_photos')
      .upsert(
        { slug: member, image_url: imageUrl, updated_at: new Date().toISOString() },
        { onConflict: 'slug' }
      )

    if (dbErr) {
      console.error('❌ DB upsert error:', dbErr.message)
      // Non-fatal — Storage upload succeeded; the public page will pick up the URL on next deploy
    }

    // ── Bust Next.js cache for the public board page ───────────
    revalidatePath('/board')
    revalidatePath('/admin/board')

    console.log(`✅ Board photo updated: ${member} → ${imageUrl}`)

    return NextResponse.json({
      success:   true,
      message:   `Photo updated for ${member}`,
      imageUrl,
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ board-photo route exception:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
