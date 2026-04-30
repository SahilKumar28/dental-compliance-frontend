import axios from "axios";

// import { clearAuthSession, getStoredToken } from "@/features/auth/lib/storage";
import { ENV } from "@/config/env";
import { getAccessToken } from "../auth/storage";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      //   beginRequest();
    }

    // const token = typeof window !== "undefined" ? getStoredToken() : null;
    const token = typeof window !== "undefined" ? getAccessToken() : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const practice_id = useAuthStore.getState().activePortalDetails?.active_practice_id


    if (practice_id) {
      config.headers["x-practice-id"] = practice_id;
    }

    return config;
  },
  (error) => {
    if (typeof window !== "undefined") {
      //   endRequest();
    }

    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      //   endRequest();
    }

    return response;
  },
  (error) => {
    if (typeof window !== "undefined") {
      //   endRequest();
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      //   clearAuthSession();

      if (window.location.pathname !== "/auth/login") {
        window.location.replace("/auth/login");
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
