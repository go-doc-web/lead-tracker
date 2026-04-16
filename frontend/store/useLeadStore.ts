// store/useLeadStore.ts
import { create } from "zustand";
import { Lead } from "@/types/lead";
import { leadsApi } from "@/api/leads";

interface LeadState {
  leads: Lead[];
  loading: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;

  fetchLeads: (
    page?: number,
    search?: string,
    status?: string,
  ) => Promise<void>;

  addLead: (lead: Lead) => void;
  removeLead: (id: string) => void;
  updateLead: (id: string, updatedFields: Partial<Lead>) => void;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  loading: false,
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,

  fetchLeads: async (page = 1, search, status) => {
    set({ loading: true });
    try {
      const response = await leadsApi.getAll(page, search, status);

      set({
        leads: response.data,
        loading: false,
        totalCount: response.meta.total,
        totalPages: response.meta.lastPage,
        currentPage: response.meta.page,
      });
    } catch (error) {
      console.error("Помилка завантаження лідів:", error);
      set({ loading: false });
    }
  },
  updateLead: (id, updatedFields) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, ...updatedFields } : l,
      ),
    })),
  removeLead: async (id) => {
    const state = get();
    const { currentPage, totalCount, fetchLeads, search, status, leads } =
      state;

    const ITEMS_PER_PAGE = 10;
    const newTotalCount = totalCount - 1;
    const newTotalPages = Math.ceil(newTotalCount / ITEMS_PER_PAGE);

    const updatedLeads = leads.filter((l) => l.id !== id);

    set({
      leads: updatedLeads,
      totalCount: newTotalCount,
      totalPages: newTotalPages > 0 ? newTotalPages : 1,
    });

    if (updatedLeads.length === 0 && currentPage > 1) {
      const prevPage = currentPage - 1;

      await fetchLeads(prevPage, search, status);
    }
  },

  addLead: (lead) =>
    set((state) => {
      const ITEMS_PER_PAGE = 10;
      const newTotalCount = state.totalCount + 1;
      const newTotalPages = Math.ceil(newTotalCount / ITEMS_PER_PAGE);

      return {
        leads: [lead, ...state.leads].slice(0, ITEMS_PER_PAGE),
        totalCount: newTotalCount,
        totalPages: newTotalPages,
      };
    }),
}));
