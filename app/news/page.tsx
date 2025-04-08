import type { Metadata } from "next"
import NewsHero from "@/components/news/news-hero"
import NewsList from "@/components/news/news-list"

export const metadata: Metadata = {
  title: "News | Bright Side Educational Support",
  description: "Stay updated with the latest news from Bright Side Educational Support",
}

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      <NewsHero />
      <NewsList />
    </main>
  )
}

