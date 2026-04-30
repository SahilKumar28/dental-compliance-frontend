import { applyTheme } from "@/styles/theme";
import { create } from "zustand";

export type Role = {
    role_id: number;
    role_name: string;
    practice_id: number;
    portal: string,
    practice_name: string,
    color_theme: ColorTheme
};

export type ColorTheme = {
    primary: string,
    secondary: string,
}

export type User = {
    id: number;
    name: string;
    email: string;
    roles: Role[]
};

export type ActivePortalDetails = {
    portal: string,
    active_practice_id: number,
    actice_role_id: number,
    active_role_name: string,
    active_color_theme: { primary: string, secondary: string }
}



type AuthState = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    activePortalDetails: ActivePortalDetails | null,
    setActivePortalDetails: (activePortalDetails: ActivePortalDetails) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    logout: () => set({ user: null }),

    activePortalDetails: null,

    setActivePortalDetails: (object) => {
        set({ activePortalDetails: object }),
            applyTheme(object.active_color_theme)
    },

    isLoading: true,

    setIsLoading: (value) => set({ isLoading: value }),

}));