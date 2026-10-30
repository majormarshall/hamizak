import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

// ─── Class name helper ───────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date formatting ─────────────────────────────────────────────
export function formatDate(date: string | Date, pattern = 'dd MMM yyyy') {
  return format(new Date(date), pattern)
}

// ─── Supabase Storage upload via Server API (Bypasses client RLS) ─
export async function uploadImage(
  file: File,
  bucket = 'gallery',
  folder = ''
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', bucket)
  formData.append('folder', folder)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const json = await res.json().catch(() => ({ error: 'Upload request failed' }))
  if (!res.ok) {
    throw new Error(json.error || `Upload failed (${res.status})`)
  }

  return json.url
}

export async function deleteImage(url: string, bucket: string) {
  // Silent fallback - deletions are handled via database server actions
  console.log(`Deleting image reference: ${url} from ${bucket}`)
}

// ─── Slugify ─────────────────────────────────────────────────────
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ─── Truncate ────────────────────────────────────────────────────
export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '…' : str
}
