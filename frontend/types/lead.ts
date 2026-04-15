export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST",
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}
export interface Lead {
  id: string;
  name: string;
  email?: string;
  company?: string;
  status: LeadStatus;
  value?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
