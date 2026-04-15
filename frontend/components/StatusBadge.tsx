export default function StatusBadge({ s }: { s: string }) {
  const labels: any = {
    NEW: "Новий",
    WON: "Виграно",
    LOST: "Програно",
    IN_PROGRESS: "В роботі",
  };
  const styles: any = {
    NEW: "bg-blue-50 text-blue-600 border-blue-100",
    WON: "bg-emerald-50 text-emerald-600 border-emerald-100",
    LOST: "bg-rose-50 text-rose-600 border-rose-100",
    IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest ${styles[s] || styles.NEW}`}
    >
      {labels[s] || s}
    </span>
  );
}
