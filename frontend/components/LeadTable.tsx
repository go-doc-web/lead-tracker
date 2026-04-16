"use client";

import { useLeadStore } from "@/store/useLeadStore";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { useEffect } from "react";

export default function LeadTable({
  search,
  status,
}: {
  search: string;
  status: string;
}) {
  const router = useRouter();
  const { leads, loading, totalPages, currentPage, fetchLeads, sort, order } =
    useLeadStore();
  useEffect(() => {
    fetchLeads(currentPage, search, status, sort, order);
  }, [search, status, sort, order, currentPage, fetchLeads]);

  if (loading && leads.length === 0)
    return <div className="p-20 text-center">Завантаження...</div>;

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
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
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
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="p-6 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Сторінка {currentPage} з {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                fetchLeads(currentPage - 1, search, status, sort, order)
              }
              className="px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase disabled:opacity-30"
            >
              Назад
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                fetchLeads(currentPage + 1, search, status, sort, order)
              }
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
