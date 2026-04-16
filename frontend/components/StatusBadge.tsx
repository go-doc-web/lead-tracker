export default function StatusBadge({ s }: { s: string }) {
  const config: Record<string, { label: string; style: string }> = {
    NEW: {
      label: "Новий",
      style: "bg-blue-50 text-blue-600 border-blue-100",
    },
    CONTACTED: {
      label: "Контакт",
      style: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    IN_PROGRESS: {
      label: "В роботі",
      style: "bg-amber-50 text-amber-600 border-amber-100",
    },
    WON: {
      label: "Виграно",
      style: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    LOST: {
      label: "Програно",
      style: "bg-rose-50 text-rose-600 border-rose-100",
    },
  };

  const current = config[s] || config.NEW;

  return (
    <span
      className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest inline-block ${current.style}`}
    >
      {current.label}
    </span>
  );
}
