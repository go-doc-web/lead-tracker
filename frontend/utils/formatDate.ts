export const formatDate = (date: string | number | Date | null | undefined) => {
  if (!date) return "—";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "Щойно"
    : d.toLocaleString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};
