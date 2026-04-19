"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import CreateLeadModal from "@/components/CreateLeadModal";
import StatsCards from "@/components/StatsCards";
import { leadsApi } from "@/api/leads";

const LeadTable = dynamic(() => import("@/components/LeadTable"), {
  ssr: false,
  loading: () => (
    <div className="p-20 text-center text-slate-400">Завантаження...</div>
  ),
});

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [page, setPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState({
    sort: "createdAt",
    order: "desc",
  });

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads", page, debouncedSearch, statusFilter, sortConfig],
    queryFn: () =>
      leadsApi.getAll(
        page,
        debouncedSearch,
        statusFilter,
        sortConfig.sort,
        sortConfig.order,
      ),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortConfig]);

  useEffect(() => {
    const timoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timoutId);
  }, [searchQuery]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort, order] = e.target.value.split(":");
    setSortConfig({ sort, order });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Lead Tracker
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
          >
            <Plus size={18} className="inline mr-2" /> Новий лід
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Пошук..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="">Всі статуси</option>
              <option value="NEW">Новий</option>
              <option value="CONTACTED">Контакт</option>
              <option value="IN_PROGRESS">В роботі</option>
              <option value="WON">Виграно</option>
              <option value="LOST">Програно</option>
            </select>

            <div className="relative">
              <select
                onChange={handleSortChange}
                value={`${sortConfig.sort}:${sortConfig.order}`}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 pr-10 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none"
              >
                <option value="createdAt:desc">Нові</option>
                <option value="createdAt:asc">Старі</option>
                <option value="value:desc">Бюджет Max</option>
                <option value="value:asc">Бюджет Min</option>
              </select>
              <ArrowUpDown
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <StatsCards />

        <div className="mt-8">
          <LeadTable
            {...leads}
            isLoading={isLoading}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          window.location.href = "/";
        }}
      />
    </main>
  );
}
