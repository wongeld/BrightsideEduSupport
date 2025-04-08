import type { Metadata } from "next"
import { getNewsById } from "@/lib/news"
import NewsDetail from "@/components/news/news-detail"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const news = await getNewsById(params.slug)

  if (!news) {
    return {
      title: "News Not Found | Bright Side Educational Support",
      description: "The requested news article could not be found",
    }
  }

  return {
    title: `${news.title} | Bright Side Educational Support`,
    description: news.excerpt,
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNewsById(params.slug)

  if (!news) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <NewsDetail news={news} />
    </main>
  )
}

