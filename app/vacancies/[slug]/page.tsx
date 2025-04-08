import type { Metadata } from "next"
import { getVacancyById } from "@/lib/vacancies"
import VacancyDetail from "@/components/vacancies/vacancy-detail"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vacancy = await getVacancyById(params.slug)

  if (!vacancy) {
    return {
      title: "Vacancy Not Found | Bright Side Educational Support",
      description: "The requested job vacancy could not be found",
    }
  }

  return {
    title: `${vacancy.title} | Bright Side Educational Support`,
    description: vacancy.excerpt,
  }
}

export default async function VacancyDetailPage({ params }: { params: { slug: string } }) {
  const vacancy = await getVacancyById(params.slug)

  if (!vacancy) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <VacancyDetail vacancy={vacancy} />
    </main>
  )
}

