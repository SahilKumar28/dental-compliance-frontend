import { useAuthStore } from "@/store/authStore";

export function setSession(user: any) {
  useAuthStore.getState().setUser(user);
}

export function clearSession() {
  useAuthStore.getState().logout();
}