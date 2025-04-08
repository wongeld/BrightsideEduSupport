import type { Metadata } from "next"
import AdminMessagesManager from "@/components/admin/messages-manager"

export const metadata: Metadata = {
  title: "Manage Messages | Bright Side Educational Support",
  description: "Admin dashboard for managing user messages",
}

export default function AdminMessagesPage() {
  return (
    <main className="min-h-screen">
      <AdminMessagesManager />
    </main>
  )
}

