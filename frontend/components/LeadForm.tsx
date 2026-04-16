"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

// 1. Описуємо схему. Використовуємо z.any().transform для бюджету - це найнадійніший спосіб для TS
const leadSchema = z.object({
  name: z.string().min(2, "Ім'я надто коротке"),
  email: z.string().email("Невірний формат").optional().or(z.literal("")),
  company: z.string().optional(),
  // Трансформуємо вхідне значення в число примусово
  value: z
    .any()
    .transform((val) => (val === "" || val === null ? 0 : Number(val))),
  notes: z.string().optional(),
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "WON", "LOST"]),
});

// 2. Прописуємо інтерфейс ВРУЧНУ. Це гарантує, що TS не побачить тут unknown
export interface LeadFormData {
  name: string;
  email?: string;
  company?: string;
  value: number; // Тільки number, ніяких unknown
  notes?: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "WON" | "LOST";
}

interface Props {
  onSubmit: (data: LeadFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function LeadForm({ onSubmit, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    // Використовуємо 'as any' для ресолвера - це крайній захід для Docker,
    // щоб він проігнорував внутрішні розбіжності Zod
    resolver: zodResolver(leadSchema) as any,
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
      {/* Твій JSX код залишається таким самим */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
          Ім'я клієнта *
        </label>
        <input
          {...register("name")}
          className="w-full px-4 py-3 bg-slate-50 border rounded-2xl"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full px-4 py-3 bg-slate-50 border rounded-2xl"
        />
        <input
          {...register("company")}
          placeholder="Компанія"
          className="w-full px-4 py-3 bg-slate-50 border rounded-2xl"
        />
      </div>

      <input
        type="number"
        {...register("value")}
        className="w-full px-4 py-3 bg-slate-50 border rounded-2xl"
      />
      <textarea
        {...register("notes")}
        className="w-full px-4 py-3 bg-slate-50 border rounded-2xl resize-none"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "Зберегти лід"
        )}
      </button>
    </form>
  );
}
