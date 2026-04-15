"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { leadsApi } from "@/api/leads";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Щоб оновити список після створення
}

export default function CreateLeadModal({ isOpen, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Затемнення фону (Overlay) */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Саме вікно */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Новий клієнт</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-4">
          {/* Сюди ми зараз додамо поля вводу */}
          <div className="p-10 text-center text-slate-400 italic text-sm">
            Форма в розробці...
          </div>
        </form>
      </div>
    </div>
  );
}
