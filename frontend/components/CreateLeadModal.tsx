"use client";

import { useState } from "react";
import { X } from "lucide-react";
import LeadForm, { LeadFormData } from "./LeadForm";
import { leadsApi } from "@/api/leads";
import { useLeadStore } from "@/store/useLeadStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLeadModal({ isOpen, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addLead } = useLeadStore();

  const handleFormSubmit = async (data: LeadFormData) => {
    // Очищаємо дані від порожніх рядків
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== undefined,
      ),
    );

    try {
      setIsSubmitting(true);
      const newLead = await leadsApi.create(cleanData);

      if (newLead) {
        addLead(newLead);
      }

      if (typeof onSuccess === "function") {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Помилка при створенні ліда:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Створити нового клієнта
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">
              Заповніть основні дані
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (Form) */}
        <div className="p-8">
          <LeadForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
