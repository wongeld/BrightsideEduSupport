import { NextResponse } from "next/server";
import {
  getAllBlogPosts,
  getBlogById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/blog";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : undefined;
    const slug = searchParams.get("slug");

    if (slug) {
      const blog = await getBlogById(slug, language as "en" | "am");
      if (!blog) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(blog);
    }

    const blogs = await getAllBlogPosts(language as "en" | "am", limit);
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const title_am = (formData.get("title_am") as string) || undefined;
    const content = formData.get("content") as string;
    const content_am = (formData.get("content_am") as string) || undefined;
    const excerpt = (formData.get("excerpt") as string) || undefined;
    const excerpt_am = (formData.get("excerpt_am") as string) || undefined;
    const published = formData.get("published") === "true";
    const image_path = (formData.get("image_path") as string) || undefined;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const result = await createBlogPost({
      title,
      title_am,
      content,
      content_am,
      excerpt,
      excerpt_am,
      image_path,
      published,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const title = (formData.get("title") as string) || undefined;
    const title_am = (formData.get("title_am") as string) || undefined;
    const content = (formData.get("content") as string) || undefined;
    const content_am = (formData.get("content_am") as string) || undefined;
    const excerpt = (formData.get("excerpt") as string) || undefined;
    const excerpt_am = (formData.get("excerpt_am") as string) || undefined;
    const published = formData.has("published")
      ? formData.get("published") === "true"
      : undefined;
    const image_path = (formData.get("image_path") as string) || undefined;

    const result = await updateBlogPost(Number.parseInt(id), {
      title,
      title_am,
      content,
      content_am,
      excerpt,
      excerpt_am,
      image_path,
      published,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteBlogPost(Number.parseInt(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
