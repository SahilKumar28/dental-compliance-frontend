import apiClient from "./axios";

export interface GetMemberParams {
  search?: string;
  roles?: string;
  status?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
  ownerId?: number;
}

export const memberService = {
  async getPractices(filters: GetMemberParams = {}) {
    try {
      const queryParams: any = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ownerId: 1,
      };
      if (filters.search) queryParams.search = filters.search;
      if (filters.roles) queryParams.roles = filters.roles;
      if (filters.status) queryParams.status = filters.status;
      if (filters.order_by) queryParams.order_by = filters.order_by;
      if (filters.order) queryParams.order = filters.order;
      const response = await apiClient.get("/staff/practice/0", {
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
  async createMember(data: { first_name: string; last_name: string; email: string; password: string; role_ids: number[] }) {
    try {
      const payload = {
        ...data,
        ownerId: 1,
        practice_id: 0
      };

      const response = await apiClient.post("/staff", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async updateMember(memberId: number, data: { role_ids: number[]; first_name?: string; last_name?: string; email?: string; password?: string }) {
    try {
      const payload = {
        role_ids: data.role_ids,
        ...(data.first_name && { first_name: data.first_name }),
        ...(data.last_name && { last_name: data.last_name }),
        ...(data.email && { email: data.email }),
        ...(data.password && { password: data.password }),
        owner_id: 1,
        practice_id: 0
      };
      const response = await apiClient.patch(`/staff/${memberId}`, payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  async getMemberById(memberId: number) {
    try {
      const response = await apiClient.get(`/staff/${memberId}`, {
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
  async deleteMember(memberId: number) {
    if (!memberId) {
      throw new Error("Member ID is required");
    }
    try {
      const response = await apiClient.delete(`/staff/${memberId}`, {
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