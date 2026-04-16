"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLeadStore } from "@/store/useLeadStore";
import { Loader2, Calendar } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

interface Props {
  search: string;
  status: string;
}

export default function LeadTable({ search, status }: Props) {
  const router = useRouter();

  const { leads, loading, fetchLeads } = useLeadStore();

  const handleRowClick = (id: string): void => {
    router.push(`leads/${id}`);
  };

  useEffect(() => {
    const load = () => {
      fetchLeads(1, search, status);
    };

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
    <div className="w-full">
      {/* ДЕСКТОП */}
      <div className="hidden sm:block">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Клієнт
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                Компанія
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Статус
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                Бюджет
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => handleRowClick(lead.id)}
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {lead.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {lead.email || "Немає email"}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600">
                  {lead.company || "—"}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge s={lead.status} />
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">
                  {lead.value ? `${lead.value.toLocaleString()} $` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* МОБІЛКА */}
      <div className="sm:hidden divide-y divide-slate-100">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => handleRowClick(lead.id)}
            className="p-5 active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-slate-900 text-base">
                  {lead.name}
                </div>
                <div className="text-xs text-slate-500">
                  {lead.email || "Немає email"}
                </div>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {lead.value ? `${lead.value.toLocaleString()} $` : "—"}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <StatusBadge s={lead.status} />
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Calendar size={12} />
                {new Date(lead.createdAt).toLocaleDateString("uk-UA")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {leads.length === 0 && !loading && (
        <div className="p-20 text-center text-slate-400 text-sm">
          Нічого не знайдено
        </div>
      )}
    </div>
  );
}
