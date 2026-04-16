"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLeadStore } from "@/store/useLeadStore";
import { Loader2, Calendar, Trash2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { leadsApi } from "@/api/leads";

interface Props {
  search: string;
  status: string;
}

export default function LeadTable({ search, status }: Props) {
  const router = useRouter();
  const { leads, loading, fetchLeads, removeLead, totalPages, currentPage } =
    useLeadStore();

  const handleRowClick = (id: string): void => {
    router.push(`leads/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Видалити цього клієнта?")) return;
    try {
      await leadsApi.delete(id);
      removeLead(id);
    } catch (err) {
      alert("Помилка при видаленні");
    }
  };

  useEffect(() => {
    const load = () => fetchLeads(1, search, status);
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [search, status, fetchLeads]);

  if (loading && leads.length === 0) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden sm:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold uppercase text-slate-400">
                  Клиент
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-400 hidden md:table-cell">
                  Компания
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-400">
                  Статус
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-400 text-right">
                  Бюджет
                </th>
                <th className="px-8 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => handleRowClick(lead.id)}
                  className="hover:bg-slate-50/50 cursor-pointer group transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lead.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {lead.email || "No email"}
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell text-sm text-slate-600">
                    {lead.company || "—"}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge s={lead.status} />
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-900">
                    {lead.value ? `${lead.value.toLocaleString()} $` : "—"}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={(e) => handleDelete(e, lead.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Мобилка */}
        <div className="sm:hidden divide-y divide-slate-100">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => handleRowClick(lead.id)}
              className="p-6 active:bg-slate-50"
            >
              <div className="flex justify-between mb-4">
                <div className="font-bold text-slate-900">{lead.name}</div>
                <div className="font-bold text-slate-900 text-sm">
                  {lead.value ? `${lead.value.toLocaleString()} $` : "—"}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <StatusBadge s={lead.status} />
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                  {new Date(lead.createdAt).toLocaleDateString("uk-UA")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Пагинация */}
      {leads.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between px-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Страница <span className="text-slate-900">{currentPage}</span> из{" "}
            <span className="text-slate-900">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchLeads(currentPage - 1, search, status)}
              disabled={currentPage === 1 || loading}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-200 rounded-2xl disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              Взад
            </button>
            <button
              onClick={() => fetchLeads(currentPage + 1, search, status)}
              disabled={currentPage === totalPages || loading}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-slate-900 text-white rounded-2xl disabled:opacity-30 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Далі
            </button>
          </div>
        </div>
      )}

      {leads.length === 0 && !loading && (
        <div className="p-20 text-center bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 mt-4">
          <p className="text-slate-400 text-sm font-medium">
            Ничего не найдено
          </p>
        </div>
      )}
    </div>
  );
}
