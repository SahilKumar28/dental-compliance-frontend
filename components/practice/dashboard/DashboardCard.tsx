"use client";

import { useAuthStore } from "@/store/authStore";


export default function DashboardCard() {

  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to practice portal, {user?.name}</p>
    </div>
  );
}
