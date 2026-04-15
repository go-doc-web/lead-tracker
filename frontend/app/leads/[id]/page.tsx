"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Lead } from "@/types/lead";
import { leadsApi } from "@/api/leads";
import { ChevronLeft, Loader2, Mail, Calendar, Building2 } from "lucide-react";

import StatusBadge from "../../../components/StatusBadge";
import Comments from "@/components/Comments";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await leadsApi.getOne(params.id as string);
        setLead(data);
      } catch (err) {
        setError("Клієнта не знайдено або сталася помилка");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchLead();
  }, [params.id]);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  if (error || !lead)
    return <div className="p-20 text-center text-red-500">{error}</div>;
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 text-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Кнопка "Назад" */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 group transition-colors cursor-pointer"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Назад до списку</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ЛІВА КОЛОНКА: Основна інформація */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              {/* Шапка картки */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {lead.name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-500 mt-2">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-base">
                      {lead.email || "Електронна пошта відсутня"}
                    </span>
                  </div>
                </div>
                <StatusBadge s={lead.status} />
              </div>

              {/* Сітка з деталями */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-slate-100">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Компанія
                  </p>
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
                    <Building2 size={20} className="text-slate-400" />
                    {lead.company || "—"}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Бюджет угоди
                  </p>
                  <p className="text-2xl font-black text-blue-600">
                    {lead.value ? `${lead.value.toLocaleString()} $` : "—"}
                  </p>
                </div>
              </div>

              {/* Нотатки */}
              <div className="mt-8">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Додаткові нотатки
                </p>
                <div className="bg-slate-50 rounded-2xl p-5 text-slate-700 text-sm leading-relaxed border border-slate-100 italic">
                  {lead.notes || "Опис відсутній..."}
                </div>
              </div>
            </div>

            {/* МІСЦЕ ДЛЯ КОМЕНТАРІВ (наступна задача) */}
            <Comments leadId={lead.id} initialComments={lead.comments || []} />
          </div>

          {/* ПРАВА КОЛОНКА: Системна інформація */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" />
                Історія запису
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Дата створення
                  </span>
                  <span className="text-slate-900 font-medium mt-1">
                    {new Date(lead.createdAt).toLocaleString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Останні зміни
                  </span>
                  <span className="text-slate-900 font-medium mt-1">
                    {new Date(lead.updatedAt).toLocaleString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
