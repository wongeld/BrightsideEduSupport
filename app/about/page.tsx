import type { Metadata } from "next"
import AboutHero from "@/components/about/about-hero"
import Mission from "@/components/about/mission"
import Vision from "@/components/about/vision"
import CoreValues from "@/components/about/core-values"
import WhyChooseUs from "@/components/about/why-choose-us"

export const metadata: Metadata = {
  title: "About Us | Bright Side Educational Support",
  description: "Learn about our mission, vision, and values at Bright Side Educational Support",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <Mission />
      <Vision />
      <CoreValues />
      <WhyChooseUs />
    </main>
  )
}

