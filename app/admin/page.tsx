import type { Metadata } from "next"
import AdminDashboard from "@/components/admin/dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Bright Side Educational Support",
  description: "Admin dashboard for Bright Side Educational Support",
}

export default function AdminPage() {
  return (
    <main className="min-h-screen">
      <AdminDashboard />
    </main>
  )
}

