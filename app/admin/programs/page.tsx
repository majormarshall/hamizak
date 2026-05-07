import { getPrograms } from '@/lib/actions'
import ProgramsManager from '@/components/admin/ProgramsManager'

export default async function AdminProgramsPage() {
  const programs = await getPrograms(false) // get all including inactive
  return (
    <div className="space-y-6">
      <div>
        <p className="admin-section-label">Content</p>
        <h1 className="text-xl font-bold text-slate-900">Programs</h1>
        <p className="text-sm text-slate-500 mt-1">Add, edit, and reorder your Montessori programs.</p>
      </div>
      <ProgramsManager initial={programs} />
    </div>
  )
}
