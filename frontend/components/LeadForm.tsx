"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

const leadSchema = z.object({
  name: z.string().min(2, "Ім'я надто коротке (мін. 2 символи)"),
  email: z.string().email("Невірний формат email").optional().or(z.literal("")),
  company: z.string().optional(),
  value: z.coerce.number().min(0, "Бюджет не може бути від'ємним").optional(),
  notes: z.string().optional(),
  status: z
    .enum(["NEW", "IN_PROGRESS", "CONTACTED", "WON", "LOST"])
    .default("NEW"),
});

export type LeadFormData = z.infer<typeof leadSchema>; // Зод зроби типи сам

interface Props {
  onSubmit: (data: LeadFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function LeadForm({ onSubmit, isSubmitting }: Props) {
  // 2. Налаштування React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      value: 0,
      notes: "",
      status: "NEW",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Поле: Ім'я */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          Ім'я клієнта *
        </label>
        <input
          {...register("name")}
          placeholder="Напр. Дарт Вейдер"
          className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
            errors.name
              ? "border-red-300 focus:ring-red-100"
              : "border-slate-100 focus:ring-blue-100"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Ряд: Email + Компанія */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            Email
          </label>
          <input
            {...register("email")}
            placeholder="example@mail.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            Компанія
          </label>
          <input
            {...register("company")}
            placeholder="Назва фірми"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Поле: Бюджет */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          Очікуваний бюджет ($)
        </label>
        <input
          type="number"
          {...register("value")}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
      {/* Поле: Нотатки */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
          Додаткові нотатки
        </label>
        <textarea
          {...register("notes")}
          placeholder="Будь-яка корисна інформація..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none text-sm"
        />
      </div>

      {/* Кнопка відправки */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-slate-300 flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Створюємо...</span>
            </>
          ) : (
            <span>Зберегти лід</span>
          )}
        </button>
      </div>
    </form>
  );
}
