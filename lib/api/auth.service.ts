import apiClient from "@/lib/api/client";
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

  setSession(user)


  const { portal, active_role_name, active_practice_id } = resolvePortal(user.roles);
  console.log(portal, active_practice_id, active_role_name)
  store.setActivePortal(portal);

  const matchedRole = user.roles.find((role: any) => {
    return (
      role.role_name === active_role_name &&
      role.practice_id === active_practice_id
    );
  });

  console.log(matchedRole?.theme)
  if (matchedRole?.theme) {
    store.setTheme(matchedRole.theme);
  }

  // useAuthStore.getState().setUser(user)

  return user;
}