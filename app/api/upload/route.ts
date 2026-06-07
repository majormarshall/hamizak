import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file') as File
    const bucket   = (formData.get('bucket') as string) || 'media'
    const folder   = (formData.get('folder') as string) || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const url     = process.env.NEXT_PUBLIC_SUPABASE_URL
    const svcKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !svcKey) {
      console.error('❌ Missing Supabase env vars — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
      return NextResponse.json({ error: 'Server misconfigured: missing Supabase credentials' }, { status: 500 })
    }

    const supabase = createClient(url, svcKey)

    // ── Ensure the bucket exists and is public ──────────────────
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets()
    if (listErr) {
      console.error('❌ Could not list buckets:', listErr.message)
    } else {
      const exists = buckets?.some(b => b.name === bucket)
      if (!exists) {
        const { error: createErr } = await supabase.storage.createBucket(bucket, { public: true })
        if (createErr) {
          console.error(`❌ Could not create bucket "${bucket}":`, createErr.message)
          return NextResponse.json({ error: `Bucket "${bucket}" does not exist and could not be created: ${createErr.message}` }, { status: 500 })
        }
        console.log(`✅ Created public bucket: ${bucket}`)
      } else {
        // Ensure it's public
        await supabase.storage.updateBucket(bucket, { public: true })
      }
    }

    // ── Upload file ─────────────────────────────────────────────
    const ext      = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    const { error: uploadErr } = await supabase.storage.from(bucket).upload(fileName, buffer, {
      contentType: file.type || `image/${ext}`,
      cacheControl: '3600',
      upsert: true, // overwrite if same path (safer)
    })

    if (uploadErr) {
      console.error('❌ Upload error:', uploadErr.message)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
    console.log(`✅ Uploaded: ${urlData.publicUrl}`)
    return NextResponse.json({ url: urlData.publicUrl })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error'
    console.error('❌ Upload route exception:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
