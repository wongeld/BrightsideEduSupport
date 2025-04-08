import type { Metadata } from "next"
import VacanciesHero from "@/components/vacancies/vacancies-hero"
import VacanciesList from "@/components/vacancies/vacancies-list"

export const metadata: Metadata = {
  title: "Job Vacancies | Bright Side Educational Support",
  description: "Explore career opportunities at Bright Side Educational Support",
}

export default function VacanciesPage() {
  return (
    <main className="min-h-screen">
      <VacanciesHero />
      <VacanciesList />
    </main>
  )
}

