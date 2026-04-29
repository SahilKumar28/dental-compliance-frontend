import apiClient from "./axios";
import { get } from "http";

export interface GetRolePermissionParams {
    ownerId?: number;
}

export const rolePermissionService = {
    async getRolePermission(filters: GetRolePermissionParams = {}) {
        try {
            const queryParams: any = {
                ownerId: 1,
            };
            const response = await apiClient.get("/role/practice/0", {
                params: queryParams
            });

            let data = response.data;

            // Object ko array me convert karo
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                data = Object.keys(data)
                    .filter(key => !isNaN(Number(key)))
                    .map(key => data[key]);
            }

            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            if (error.response) {
                console.error("Backend Error Data:", error.response.data);
            }
            throw error;
        }
    },
    // role-permission-service.ts
    async getAllPermissions() {
        try {
            const response = await apiClient.get(`/permission`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error("Backend Error Data:", error.response.data);
            }
            throw error;
        }
    },

    async getPermissionsByRole(roleId: number) { // ye naam abhi bhi rakh sakte ho but ye all permissions deta hai
        try {
            const response = await apiClient.get(`/permission`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async createRole(data: { name: string; description: string; permission_ids: number[] }) {
        try {
            const payload = {
                ...data,
                owner_id: 1,
                practice_id: 0
            };
            const response = await apiClient.post("/role", payload);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async updateRole(roleId: number, data: { name: string; description: string; permission_ids: number[] }) {
        try {
            const payload = {
                ...data,
                owner_id: 1,
                practice_id: 0
            };
            const response = await apiClient.patch(`/role/${roleId}`, payload);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async getRolesById(roleId: number) {
        try {
            const response = await apiClient.get(`/role/${roleId}`, {
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