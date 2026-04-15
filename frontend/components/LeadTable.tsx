"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lead } from "@/types/lead";
import { leadsApi } from "@/api/leads";
import { Loader2, Mail, Calendar } from "lucide-react";

interface Props {
  search: string;
  status: string;
}

export default function LeadTable({ search, status }: Props) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRowClick = (id: string): void => {
    router.push(`leads/${id}`);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Викликаємо наш API з параметрами пошуку
        const res = await leadsApi.getAll(1, search, status);
        setLeads(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Додаємо невелику затримку (debounce), щоб не спамити бэкенд на кожну літеру
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [search, status]);

  if (loading && leads.length === 0)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  const StatusBadge = ({ s }: { s: string }) => {
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
        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${styles[s] || styles.NEW}`}
      >
        {labels[s] || s}
      </span>
    );
  };

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
