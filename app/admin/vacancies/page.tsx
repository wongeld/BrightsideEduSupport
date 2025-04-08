import type { Metadata } from "next"
import AdminVacanciesManager from "@/components/admin/vacancies-manager"

export const metadata: Metadata = {
  title: "Manage Vacancies | Bright Side Educational Support",
  description: "Admin dashboard for managing job vacancies",
}

export default function AdminVacanciesPage() {
  return (
    <main className="min-h-screen">
      <AdminVacanciesManager />
    </main>
  )
}

