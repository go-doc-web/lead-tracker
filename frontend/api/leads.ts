import { Lead, ApiResponse } from "../types/lead";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const leadsApi = {
  getAll: async (
    page = 1,
    search = "",
    status = "",
  ): Promise<ApiResponse<Lead>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      ...(search && { search }),
      ...(status && { status }),
    });

    const res = await fetch(`${API_URL}/leads?${params}`);

    if (!res.ok) {
      throw new Error("error boot leads");
    }

    return res.json();
  },

  // Create new Lead
  create: async (data: Partial<Lead>): Promise<Lead> => {
    const res = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error");
    return res.json();
  },

  getOne: async (id: string): Promise<Lead> => {
    const res = await fetch(`${API_URL}/leads/${id}`);

    if (!res.ok) {
      throw new Error("Client not found");
    }

    return res.json();
  },

  addComment: async (leadId: string, text: string): Promise<Comment> => {
    const res = await fetch(`${API_URL}/leads/${leadId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, leadId }),
    });
    if (!res.ok) throw new Error("Error");
    return res.json();
  },
};
