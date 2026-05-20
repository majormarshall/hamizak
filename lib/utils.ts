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

// ─── Supabase Storage upload ─────────────────────────────────────
import { uploadImageServer, deleteImageServer } from './actions'

export async function uploadImage(
  file: File,
  bucket: string,
  folder = ''
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  return uploadImageServer(formData, bucket, folder)
}

export async function deleteImage(url: string, bucket: string) {
  return deleteImageServer(url, bucket)
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
