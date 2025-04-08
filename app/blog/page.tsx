import type { Metadata } from "next"
import BlogHero from "@/components/blog/blog-hero"
import BlogList from "@/components/blog/blog-list"

export const metadata: Metadata = {
  title: "Blog | Bright Side Educational Support",
  description: "Read our latest blog posts about special education and support services",
}

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <BlogHero />
      <BlogList />
    </main>
  )
}

