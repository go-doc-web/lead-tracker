"use client";

import { useLeadStore } from "@/store/useLeadStore";
import { Users, Target, CircleDollarSign, TrendingUp } from "lucide-react";

export default function StatsCards() {
  const { leads, totalCount } = useLeadStore();

  // Рахуємо статистику по завантаженим даним
  const wonLeads = leads.filter((l) => l.status === "WON").length;
  const inProgress = leads.filter(
    (l) => l.status === "IN_PROGRESS" || l.status === "CONTACTED",
  ).length;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);

  const stats = [
    {
      label: "Всього лідів",
      value: totalCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "В роботі",
      value: inProgress,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Виграно",
      value: wonLeads,
      icon: Target,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Загальний бюджет",
      value: `${totalValue.toLocaleString()} $`,
      icon: CircleDollarSign,
      color: "text-slate-900",
      bg: "bg-slate-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}
          >
            <stat.icon className={stat.color} size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
