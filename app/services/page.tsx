import type { Metadata } from "next"
import ServicesHero from "@/components/services/services-hero"
import ServicesList from "@/components/services/services-list"

export const metadata: Metadata = {
  title: "Services | Bright Side Educational Support",
  description: "Explore our comprehensive services for students with special needs",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <ServicesHero />
      <ServicesList />
    </main>
  )
}

