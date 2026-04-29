import { applyTheme } from "@/styles/theme";
import { create } from "zustand";

export type Role = {
    role_id: number;
    role_name: string;
    practice_id: number;
    portal: string,
    practice_name: string
};

export type Theme = {
    primary: string,
    secondary: string,
}

export type User = {
    id: number;
    name: string;
    email: string;
    roles: Role[]
};



type AuthState = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    activePortal: string | null,
    setActivePortal: (portal: string) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
    theme: Theme | null,
    setTheme: (theme: Theme) => void
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    logout: () => set({ user: null }),

    activePortal: null,

    setActivePortal: (portal) => set({ activePortal: portal }),

    isLoading: true,

    setIsLoading: (value) => set({ isLoading: value }),

    theme: { primary: '', secondary: '' },

    setTheme: (theme) => {
        set({ theme });
        applyTheme(theme); 
    },
}));