'use client'

import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

export default function Home() {

  const { isLoading, activePortalDetails } = useAuthStore()

  if (isLoading) {
    return <>
      waiting
    </>
  }

  if (activePortalDetails?.portal === 'admin') redirect("/admin/dashboard")
  else if (activePortalDetails?.portal === 'practice') redirect("/practice/dashboard")
  return <>
    No portal
  </>
}