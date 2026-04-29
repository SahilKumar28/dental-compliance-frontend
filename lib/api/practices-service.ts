import apiClient from "./axios";

export interface GetParaticsParams {
  search?: string;
  // roles?: string;
  // status?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
  ownerId?: number;
}

export interface PracticePayload {
  abbreviated_name: string;
  legal_name: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  start_date: number; // unix timestamp
  addresses: string[];
  additional_emails: string[];
  websites: string[];
  primary_email: string;
  logo?: File | null;
  primary_color: string,
    secondary_color: string,
  owner_last_name: string,
  owner_first_name: string,
  owner_email: string,
  owner_password: string,
  domain_name: string
}

export const paraticeService = {
  async getPractices(filters: GetParaticsParams = {}) {
    try {
      const queryParams: any = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ownerId: 1,
      };
      if (filters.search) queryParams.search = filters.search;
      if (filters.order_by) queryParams.order_by = filters.order_by;
      if (filters.order) queryParams.order = filters.order;
      const response = await apiClient.get("/practice/", {
        params: queryParams
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Backend Error Data:", error.response.data);
      }
      throw error;
    }
  },
  async createPractice(data: any) {
    // Logo ko alag se upload karna padega agar backend URL chahta hai
    let logoUrl = '';

    if (data.logo instanceof File) {
      // Pehle logo upload karo
      const logoFormData = new FormData();
      logoFormData.append('file', data.logo);
      const uploadRes = await apiClient.post('/upload', logoFormData);
      logoUrl = uploadRes.data.url; // backend se URL milega
    }

    const payload = {
      ...data,
      logo: logoUrl, // string URL
      primary_color: data.primary_color ,
      secondary_color: data.secondary_color,
      start_date: data.start_date, // "2025-04-28" string
      owner_id: 1,
    };

    delete payload.id;

    const response = await apiClient.post('/practice', payload); // JSON bhejo
    return response.data;
  },

  async updatePractice(practiceId: number, data: any) {
    let logoUrl = data.logo_url || '';

    if (data.logo instanceof File) {
      const logoFormData = new FormData();
      logoFormData.append('file', data.logo);
      const uploadRes = await apiClient.post('/upload', logoFormData);
      logoUrl = uploadRes.data.url;
    }

    const payload = {
      ...data,
      logo: logoUrl,
      primary_color: data.primary_color,
      secondary_color: data.secondary_color,
      start_date: data.start_date,
      owner_id: 1,
    };

    delete payload.logo_url;
    delete payload.id;

    const response = await apiClient.patch(`/practice/${practiceId}`, payload);
    return response.data;
  },

  // async getPracticeById(practiceId: number) {
  //   const response = await apiClient.get(`/practices/${practiceId}`);
  //   return response.data;
  // },

  async getPracticeById(practiceId: number) {
    try {
      const response = await apiClient.get(`/practice/${practiceId}`, {
        params: {
          practiceId: 0,
          ownerId: 1
        }
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async deletePractice(practiceId: number) {
    if (!practiceId) {
      throw new Error("Member ID is required");
    }
    try {
      const response = await apiClient.delete(`/practices/${practiceId}`, {
        params: {
          practiceId: 0,
          ownerId: 1
        }
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};