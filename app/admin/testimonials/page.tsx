// app/admin/testimonials/page.tsx
import { getTestimonials } from '@/lib/actions'
import TestimonialsManager from '@/components/admin/TestimonialsManager'

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials(false)
  return (
    <div className="space-y-6">
      <div>
        <p className="admin-section-label">Content</p>
        <h1 className="text-xl font-bold text-slate-900">Testimonials</h1>
        <p className="text-sm text-slate-500 mt-1">Manage parent testimonials. Approve them to show on the website.</p>
      </div>
      <TestimonialsManager initial={testimonials} />
    </div>
  )
}
