import type { Metadata } from "next"
import { getBlogById } from "@/lib/blog"
import BlogDetail from "@/components/blog/blog-detail"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogById(params.slug)

  if (!blog) {
    return {
      title: "Blog Not Found | Bright Side Educational Support",
      description: "The requested blog post could not be found",
    }
  }

  return {
    title: `${blog.title} | Bright Side Educational Support`,
    description: blog.excerpt,
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogById(params.slug)

  if (!blog) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <BlogDetail blog={blog} />
    </main>
  )
}

