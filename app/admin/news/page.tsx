import type { Metadata } from "next"
import AdminNewsManager from "@/components/admin/news-manager"

export const metadata: Metadata = {
  title: "Manage News | Bright Side Educational Support",
  description: "Admin dashboard for managing news",
}

export default function AdminNewsPage() {
  return (
    <main className="min-h-screen">
      <AdminNewsManager />
    </main>
  )
}

