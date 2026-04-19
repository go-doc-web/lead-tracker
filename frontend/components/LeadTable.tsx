"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Lead } from "@/types/lead";
import { leadsApi } from "@/api/leads";
import StatusBadge from "./StatusBadge";
import { Trash2 } from "lucide-react"; // Імпортуємо іконку
import { toast } from "sonner";

interface LeadTableProps {
  data?: Lead[];
  meta?: {
    total: number;
    page: number;
    lastPage: number;
  };
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function LeadTable({
  data: leads = [],
  meta,
  isLoading,
  onPageChange,
}: LeadTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Клієнта видалено");
    },
    onError: () => {
      toast.error("Не вдалося видалити клієнта");
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Ви впевнені, що хочете видалити цього клієнта?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading && (!leads || leads.length === 0)) {
    return <div className="p-20 text-center">Завантаження...</div>;
  }

  if ((!isLoading && !leads) || leads.length === 0) {
    return (
      <div className="p-20 text-center text-slate-400">Нічого не знайдено</div>
    );
  }

  const totalPages = meta?.lastPage || 0;
  const currentPage = meta?.page || 1;
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Клієнт
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Статус
            </th>
            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
              Бюджет
            </th>
            {/* Додаємо порожній заголовок для колонки дій */}
            <th className="px-6 py-5 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead: Lead) => (
            <tr
              key={lead.id}
              onClick={() => router.push(`/leads/${lead.id}`)}
              className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
            >
              <td className="px-8 py-5">
                <div className="font-bold text-slate-900 group-hover:text-blue-600">
                  {lead.name}
                </div>
                <div className="text-xs text-slate-400">
                  {lead.company || "—"}
                </div>
              </td>
              <td className="px-6 py-5">
                <StatusBadge s={lead.status} />
              </td>
              <td className="px-8 py-5 text-right font-black text-slate-900">
                {lead.value ? `${lead.value.toLocaleString()} $` : "—"}
              </td>
              {/* Кнопка видалення */}
              <td className="px-6 py-5">
                <button
                  onClick={(e) => handleDelete(e, lead.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагінація */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Сторінка {currentPage} ... {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase disabled:opacity-30"
            >
              Назад
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase disabled:opacity-30"
            >
              Далі
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
