import apiClient from "@/lib/api/axios";
import { setSession, clearSession } from "./session";
import { useAuthStore } from "@/store/authStore";
import { resolvePortal } from "./resolvePortal";


export async function initSession() {
  const store = useAuthStore.getState();

  try {
    const res = await apiClient.get("/auth/me");
    const user = res.data.user;

    store.setUser(user);

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


  } catch (err) {
    clearSession();
  } finally {
    store.setIsLoading(false);
  }
}