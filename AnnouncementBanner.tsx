export default function AnnouncementBanner({ text, color }: { text: string; color?: string }) {
  return (
    <div
      className="text-white text-center text-xs py-2 px-4 font-black uppercase tracking-widest flex items-center justify-center gap-4"
      style={{ background: color || '#14b8a6' }}
    >
      <span className="opacity-90">{text}</span>
      <span className="bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-amber-900/20">
        New
      </span>
    </div>
  )
}
