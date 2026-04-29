'use client'

import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

export default function Home() {

  const isLoading = useAuthStore((state) => state.isLoading);
  const activePortal = useAuthStore((state) => state.activePortal);

  if (isLoading) {
    return <>
      waiting
    </>
  }

  if (activePortal === 'admin') redirect("/admin/dashboard")
  else if (activePortal === 'practice') redirect("/practice/dashboard")
  return <>
    No portal
  </>
}