import Hero from "@/components/home/hero"
import Services from "@/components/home/services"
import About from "@/components/home/about"
import Testimonials from "@/components/home/testimonials"
import Partners from "@/components/home/partners"
import LatestNews from "@/components/home/latest-news"
import LatestBlogs from "@/components/home/latest-blogs"
import Vacancies from "@/components/home/vacancies"
import Contact from "@/components/home/contact"
import CoreValues from "@/components/home/core-values"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <CoreValues />
      <Services />
      <Testimonials />
      <Partners />
      <LatestNews />
      <LatestBlogs />
      <Vacancies />
      <Contact />
    </main>
  )
}

