import apiClient from "./axios";

export interface GetMemberParams {
    page?: number;
    per_page?: number;
    search?: string;
    roles?: string;
    status?: string;
    order_by?: string;
    order?: string;
}

export const memberService = {
    async getPractices(filters: GetMemberParams = {}) {
        try {
            const queryParams: any = {
                page: filters.page || 1,
                per_page: filters.per_page || 10,
                ownerId: 1,
            };

            // Filters add karo
            if (filters.search) queryParams.search = filters.search;
            if (filters.roles) queryParams.roles = filters.roles;
            if (filters.status) queryParams.status = filters.status;
            if (filters.order_by) queryParams.order_by = filters.order_by;
            if (filters.order) queryParams.order = filters.order;

            const response = await apiClient.get("/staff/practice/0", {
                params: queryParams
            });

            let data = response.data;

            // Object ko array me convert karo, message/success keys skip karo
            if (data && typeof data === 'object' &&!Array.isArray(data)) {
                const memberArray = Object.keys(data)
              .filter(key =>!isNaN(Number(key))) // sirf 0,1,2... keys
              .map(key => data[key]);

                return {
                    data: memberArray,
                    total: data.total || memberArray.length,
                    message: data.message,
                    success: data.success
                };
            }

            return data;
        } catch (error: any) {
            if (error.response) {
                console.error("Backend Error Data:", error.response.data);
            }
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

    async createMember(data: any) {
        try {
            const payload = {
          ...data,
                owner_id: 1,
                practice_id: 0
            };
            const response = await apiClient.post("/staff", payload);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async updateMember(memberId: number, data: any) {
        try {
            const payload = {
          ...data,
                owner_id: 1,
                practice_id: 0
            };
            const response = await apiClient.patch(`/staff/${memberId}`, payload);
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