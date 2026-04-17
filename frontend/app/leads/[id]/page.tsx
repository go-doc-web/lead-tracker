"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lead } from "@/types/lead";
import { leadsApi } from "@/api/leads";
import {
  ChevronLeft,
  Loader2,
  Mail,
  Calendar,
  Building2,
  Edit2,
  Check,
  X,
  DollarSign,
} from "lucide-react";
import { useLeadStore } from "@/store/useLeadStore";
import StatusBadge from "../../../components/StatusBadge";
import Comments from "@/components/Comments";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { updateLead } = useLeadStore();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (!lead) return;

    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await leadsApi.getOne(params.id as string);
        setLead(data);
        setFormData(data);
      } catch (err) {
        setError("Клієнта не знайдено");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchLead();
  }, [params.id]);

  const handleSave = async () => {
    try {
      const payload: Partial<Lead> = {
        name: formData.name,
        email: formData.email,
        status: formData.status,
        company: formData.company,
        value: formData.value,
        notes: formData.notes,
      };

      const updatedResponse = await leadsApi.update(lead!.id, payload);

      const finalLead = {
        ...lead,
        ...updatedResponse,
      };

      setLead(finalLead);
      updateLead(lead!.id, finalLead);
      setIsEditing(false);
      toast.success("Дані збережено");
    } catch (err) {
      console.error("Помилка при збереженні:", err);
      toast.error(
        "Помилка: сервер відхилив запит (Bad Request). Перевірте поля.",
      );
    }
  };

  const formatDate = (date: any) => {
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

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  if (error || !lead)
    return (
      <div className="p-20 text-center text-red-500 font-bold">{error}</div>
    );

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase text-[10px] tracking-widest"
          >
            <ChevronLeft size={16} /> Назад до списку
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:shadow-md transition-all"
            >
              <Edit2 size={14} /> Редагувати
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(lead);
                }}
                className="px-5 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest"
              >
                Скасувати
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                <Check size={14} /> Зберегти
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <input
                      className="text-2xl sm:text-4xl font-black text-slate-900 outline-none border-b-2 border-blue-500 w-full bg-transparent pb-1"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {lead.name}
                    </h1>
                  )}

                  <div className="flex items-center gap-2 text-slate-500 mt-4">
                    <Mail size={16} className="text-slate-300" />
                    {isEditing ? (
                      <input
                        className="text-sm font-medium outline-none border-b border-slate-100 w-full"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {lead.email || "Електронна пошта відсутня"}
                      </span>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="w-full sm:w-auto">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Статус
                    </label>
                    <select
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all"
                      value={formData.status || "NEW"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as any,
                        })
                      }
                    >
                      <option value="NEW">Новий</option>
                      <option value="CONTACTED">Контакт</option>
                      <option value="IN_PROGRESS">В роботі</option>
                      <option value="WON">Виграно</option>
                      <option value="LOST">Програно</option>
                    </select>
                  </div>
                ) : (
                  <StatusBadge s={lead.status} />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 py-10 border-y border-slate-50">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Building2 size={14} /> Компанія
                  </label>
                  {isEditing ? (
                    <input
                      className="w-full font-bold text-slate-900 outline-none border-b border-slate-100"
                      value={formData.company || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-lg">
                      {lead.company || "—"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <DollarSign size={14} /> Бюджет угоди
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-full text-xl font-black text-blue-600 outline-none border-b border-slate-100"
                      value={formData.value || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="text-2xl font-black text-blue-600 tracking-tight">
                      {lead.value ? `${lead.value.toLocaleString()} $` : "—"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                  Додаткові нотатки
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full bg-slate-50 rounded-[24px] p-6 text-slate-700 text-sm border border-slate-100 outline-none focus:border-blue-200 transition-all min-h-[120px]"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                ) : (
                  <div className="bg-slate-50/50 rounded-[24px] p-6 text-slate-600 text-sm leading-relaxed border border-slate-100 font-medium whitespace-pre-wrap">
                    {lead.notes || "Опис відсутній..."}
                  </div>
                )}
              </div>
            </div>
            <Comments leadId={lead.id} initialComments={lead.comments || []} />
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm h-fit">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" /> Історія запису
            </h3>
            <div className="space-y-8 pl-4 border-l border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Дата створення
                </span>
                <span className="text-slate-900 font-bold mt-1 text-sm">
                  {formatDate(lead.createdAt)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Останні зміни
                </span>
                <span className="text-slate-900 font-bold mt-1 text-sm">
                  {formatDate(lead.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
