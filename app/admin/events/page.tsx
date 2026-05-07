// app/admin/events/page.tsx
import { getEvents } from '@/lib/actions'
import EventsManager from '@/components/admin/EventsManager'

export default async function AdminEventsPage() {
  const events = await getEvents(false)
  return (
    <div className="space-y-6">
      <div>
        <p className="admin-section-label">Content</p>
        <h1 className="text-xl font-bold text-slate-900">Events &amp; News</h1>
        <p className="text-sm text-slate-500 mt-1">Create news posts, event announcements, and school updates.</p>
      </div>
      <EventsManager initial={events} />
    </div>
  )
}
