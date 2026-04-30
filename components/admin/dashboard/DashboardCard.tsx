"use client";

import { useAuthStore } from "@/store/authStore";

export default function DashboardCard() {

  const {user, isLoading, activePortalDetails} = useAuthStore()


  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to {activePortalDetails?.portal} portal, {user?.name}</p>
    </div>
  );
}