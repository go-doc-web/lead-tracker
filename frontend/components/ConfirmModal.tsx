"use client";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-4xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              disabled={isLoading}
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Скасувати
            </button>
            <button
              disabled={isLoading}
              onClick={onConfirm}
              className="flex-1 px-6 py-3.5 bg-red-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Видалити"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
