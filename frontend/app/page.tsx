"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Plus, Search, SlidersHorizontal } from "lucide-react";
import CreateLeadModal from "@/components/CreateLeadModal";

const LeadTable = dynamic(() => import("@/components/LeadTable"), {
  ssr: false,
  loading: () => (
    <div className="p-20 text-center text-slate-400">
      Завантаження таблиці...
    </div>
  ),
});

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Lead Tracker
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Керування воронкою продажів
            </p>
          </div>
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm active:transform active:scale-[0.98] cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            <span>Новий лід</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Пошук клієнтів за ім'ям, email або компанією..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:w-44 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Всі статуси</option>
              <option value="NEW">Новий</option>
              <option value="IN_PROGRESS">В роботі</option>
              <option value="WON">Виграно</option>
              <option value="LOST">Програно</option>
            </select>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 md:hidden">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Список лідів */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          <LeadTable search={searchQuery} status={statusFilter} />
        </div>
      </div>
      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </main>
  );
}
