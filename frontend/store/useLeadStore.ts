// store/useLeadStore.ts
import { create } from "zustand";
import { Lead } from "@/types/lead";
import { leadsApi } from "@/api/leads";

interface LeadState {
  leads: Lead[];
  loading: boolean;
  // Функція для завантаження списку
  fetchLeads: (
    page?: number,
    search?: string,
    status?: string,
  ) => Promise<void>;
  // Функція для швидкого додавання ліда в список без перезапиту до БД
  addLead: (lead: Lead) => void;
  removeLead: (id: string) => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  loading: false,

  fetchLeads: async (page, search, status) => {
    set({ loading: true });
    try {
      const response = await leadsApi.getAll(page, search, status);
      set({ leads: response.data, loading: false });
    } catch (error) {
      console.error("Помилка завантаження лідів:", error);
      set({ loading: false });
    }
  },
  removeLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
    })),

  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
    })),
}));
