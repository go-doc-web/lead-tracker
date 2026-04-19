"use client";
import {
  Users,
  Target,
  CircleDollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function StatsCards({
  stats,
  isLoading,
}: {
  stats?: any;
  isLoading: boolean;
}) {
  // 1. Создаем массив конфигурации на основе данных из объекта stats
  const statsConfig = [
    {
      label: "Всього лідів",
      value: stats?.totalCount || 0,
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "В роботі",
      value: stats?.inProgressCount || 0,
      icon: Target,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      label: "Виграно",
      value: stats?.wonCount || 0,
      icon: TrendingUp,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      label: "Загальна сума",
      value: `${stats?.totalValue || 0} $`,
      icon: CircleDollarSign,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsConfig.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader2 size={16} className="animate-spin text-slate-300" />
            </div>
          )}
          <div
            className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0`}
          >
            <stat.icon className={stat.color} size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
