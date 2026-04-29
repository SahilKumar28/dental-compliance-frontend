import apiClient from "@/lib/api/client";
import { setAccessToken } from "../auth/storage";
import { useAuthStore } from "@/store/authStore";
import { setSession } from "../auth/session";
import { resolvePortal } from "../auth/resolvePortal";

export async function login(email: string, password: string) {
  const res = await apiClient.post("/auth/login", {
    email,
    password,
  });
  const { access_token, user } = res.data.data;

  setAccessToken(access_token);

  setSession(user)


  const activePortal = resolvePortal(user.roles)
  useAuthStore.getState().setActivePortal(activePortal);

  // useAuthStore.getState().setUser(user)

  return user;
}