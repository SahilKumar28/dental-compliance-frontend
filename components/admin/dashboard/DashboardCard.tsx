"use client";

import { useAuthStore } from "@/store/authStore";

export default function DashboardCard() {
  const user = useAuthStore((state) => state.user);
  const activePortal = useAuthStore((state) => state.activePortal);
  const isLoading = useAuthStore((state) => state.isLoading);


  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to {activePortal} portal, {user?.name}</p>
    </div>
  );
}