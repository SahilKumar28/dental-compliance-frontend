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

    const activePortalDetails = resolvePortal(user);
    const { portal, active_role_name, active_practice_id, active_role_id, active_color_theme } = activePortalDetails
    console.log(portal, active_practice_id, active_role_name, active_role_id, active_color_theme)

    store.setActivePortalDetails(activePortalDetails)


  } catch (err) {
    clearSession();
  } finally {
    store.setIsLoading(false);
  }
}