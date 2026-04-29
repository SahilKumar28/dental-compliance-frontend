import { Theme } from "@/store/authStore";

export const COLORS = {
    primary: "#4F46E5",
    secondary: "#4F46E5",
    background: "#0B0F19",
    card: "#111521",
    text: "#FFFFFF",
    danger: "#EF4444",
};

export function applyTheme(theme: { primary: string; secondary: string }) {
    const toRgbChannels = (hex: string): string => {
        const clean = hex.replace("#", "");
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        return `${r} ${g} ${b}`;
    };

    document.documentElement.style.setProperty(
        "--tw-color-primary",
        toRgbChannels(theme.primary)
    );
    document.documentElement.style.setProperty(
        "--tw-color-secondary",
        toRgbChannels(theme.secondary)
    );
}