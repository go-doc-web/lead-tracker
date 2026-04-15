"use client";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function LeadDetailPage() {
  const params = useParams(); // Отримуємо ID з URL

  const router = useRouter();
  const id = params.id;

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Кнопка "Назад" */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
        >
          <ChevronLeft size={20} />
          <span>Назад до списку</span>
        </button>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Деталі ліда</h1>
          <p className="text-slate-500 mt-2 text-sm">ID запису: {id}</p>
        </div>
      </div>
    </main>
  );
}
