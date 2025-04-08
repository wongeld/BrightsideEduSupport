import type { Metadata } from "next"
import AdminSettings from "@/components/admin/settings"

export const metadata: Metadata = {
  title: "Admin Settings | Bright Side Educational Support",
  description: "Admin settings for Bright Side Educational Support",
}

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen">
      <AdminSettings />
    </main>
  )
}

