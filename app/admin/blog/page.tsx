import type { Metadata } from "next"
import AdminBlogManager from "@/components/admin/blog-manager"

export const metadata: Metadata = {
  title: "Manage Blog | Bright Side Educational Support",
  description: "Admin dashboard for managing blog posts",
}

export default function AdminBlogPage() {
  return (
    <main className="min-h-screen">
      <AdminBlogManager />
    </main>
  )
}

