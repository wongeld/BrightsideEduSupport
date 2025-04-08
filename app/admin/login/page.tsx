import type { Metadata } from "next"
import AdminLogin from "@/components/admin/login"

export const metadata: Metadata = {
  title: "Admin Login | Bright Side Educational Support",
  description: "Login to the admin dashboard",
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <AdminLogin />
    </main>
  )
}

