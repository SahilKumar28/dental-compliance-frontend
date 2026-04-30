import apiClient from "@/lib/api/axios";
import { setAccessToken } from "../auth/storage";
import { useAuthStore } from "@/store/authStore";
import { setSession } from "../auth/session";
import { resolvePortal } from "../auth/resolvePortal";

export async function login(email: string, password: string) {

  const store = useAuthStore.getState();

  const res = await apiClient.post("/auth/login", {
    email,
    password,
  });
  const { access_token, user } = res.data;

  setAccessToken(access_token);

  store.setUser(user)


  const data = resolvePortal(user);
  store.setActivePortalDetails(data);

  return user;
}