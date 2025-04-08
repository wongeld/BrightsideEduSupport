import { NextResponse } from "next/server";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "@/lib/news";
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
      const news = await getNewsById(slug, language as "en" | "am");
      if (!news) {
        return NextResponse.json({ error: "News not found" }, { status: 404 });
      }
      return NextResponse.json(news);
    }

    const news = await getAllNews(language as "en" | "am", limit);
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
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

    const result = await createNews({
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
    console.error("Error creating news:", error);
    return NextResponse.json(
      {
        error: "Failed to create news",
        details: error instanceof Error ? error.message : String(error),
      },
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
        { error: "News ID is required" },
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

    const result = await updateNews(Number.parseInt(id), {
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
    console.error("Error updating news:", error);
    return NextResponse.json(
      {
        error: "Failed to update news",
        details: error instanceof Error ? error.message : String(error),
      },
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
        { error: "News ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteNews(Number.parseInt(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
