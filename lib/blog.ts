import { query } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export interface BlogPost {
  id: number;
  title: string;
  title_am?: string;
  slug: string;
  content: string;
  content_am?: string;
  excerpt?: string;
  excerpt_am?: string;
  image_path?: string;
  published: boolean;
  author_id?: number;
  created_at: string;
  updated_at: string;
}

export async function getAllBlogPosts(
  language = "en",
  limit?: number,
  publishedOnly = true
) {
  try {
    let sql = `
      SELECT 
        id, 
        ${language === "en" ? "title" : "COALESCE(title_am, title) as title"}, 
        slug, 
        ${
          language === "en"
            ? "excerpt"
            : "COALESCE(excerpt_am, excerpt) as excerpt"
        }, 
        image_path, 
        published, 
        created_at, 
        updated_at 
      FROM blog_posts
    `;

    const params: any[] = [];

    if (publishedOnly) {
      sql += " WHERE published = ?";
      params.push(true);
    }

    sql += " ORDER BY created_at DESC";

    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);
    }

    const results = (await query(sql, params)) as BlogPost[];
    return results;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
}

export async function getBlogById(slug: string, language = "en") {
  try {
    const sql = `
      SELECT 
        id, 
        ${language === "en" ? "title" : "COALESCE(title_am, title) as title"}, 
        slug, 
        ${
          language === "en"
            ? "content"
            : "COALESCE(content_am, content) as content"
        }, 
        ${
          language === "en"
            ? "excerpt"
            : "COALESCE(excerpt_am, excerpt) as excerpt"
        }, 
        image_path, 
        published, 
        author_id, 
        created_at, 
        updated_at 
      FROM blog_posts 
      WHERE slug = ?
    `;

    const results = (await query(sql, [slug])) as BlogPost[];

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error("Error fetching blog post by ID:", error);
    throw error;
  }
}

export async function createBlogPost(blogData: {
  title: string;
  title_am?: string;
  content: string;
  content_am?: string;
  excerpt?: string;
  excerpt_am?: string;
  image_path?: string;
  published?: boolean;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const {
      title,
      title_am,
      content,
      content_am,
      excerpt,
      excerpt_am,
      image_path,
      published = false,
    } = blogData;

    // Generate slug from title
    const slug = slugify(title);

    // Insert into database
    const result = (await query(
      `INSERT INTO blog_posts 
        (title, title_am, slug, content, content_am, excerpt, excerpt_am, image_path, published, author_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        title_am || null,
        slug,
        content,
        content_am || null,
        excerpt || null,
        excerpt_am || null,
        image_path || null,
        published,
        user.id,
      ]
    )) as { insertId: number };

    return {
      id: result.insertId,
      title,
      title_am,
      slug,
      content,
      content_am,
      excerpt,
      excerpt_am,
      image_path,
      published,
      author_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
}

export async function updateBlogPost(
  id: number,
  blogData: {
    title?: string;
    title_am?: string;
    content?: string;
    content_am?: string;
    excerpt?: string;
    excerpt_am?: string;
    image_path?: string;
    published?: boolean;
  }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get existing blog post
    const existingPost = (await query("SELECT * FROM blog_posts WHERE id = ?", [
      id,
    ])) as BlogPost[];

    if (existingPost.length === 0) {
      throw new Error("Blog post not found");
    }

    const current = existingPost[0];

    // Prepare update data
    const {
      title = current.title,
      title_am = current.title_am,
      content = current.content,
      content_am = current.content_am,
      excerpt = current.excerpt,
      excerpt_am = current.excerpt_am,
      image_path = current.image_path,
      published = current.published,
    } = blogData;

    // Generate new slug if title changed
    const slug = title !== current.title ? slugify(title) : current.slug;

    // Delete old image if a new one is provided and old one exists
    if (image_path && image_path !== current.image_path && current.image_path) {
      try {
        const oldFilePath = path.join(
          process.cwd(),
          "public",
          current.image_path
        );
        await fs
          .unlink(oldFilePath)
          .catch((err) => console.log("File not found, skipping delete"));
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    // Update in database
    await query(
      `UPDATE blog_posts 
       SET title = ?, title_am = ?, slug = ?, content = ?, content_am = ?, 
           excerpt = ?, excerpt_am = ?, image_path = ?, published = ? 
       WHERE id = ?`,
      [
        title,
        title_am || null,
        slug,
        content,
        content_am || null,
        excerpt || null,
        excerpt_am || null,
        image_path || null,
        published,
        id,
      ]
    );

    return {
      id,
      title,
      title_am,
      slug,
      content,
      content_am,
      excerpt,
      excerpt_am,
      image_path,
      published,
      author_id: current.author_id,
      created_at: current.created_at,
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: number) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get existing blog post to find image path
    const existingPost = (await query(
      "SELECT image_path FROM blog_posts WHERE id = ?",
      [id]
    )) as BlogPost[];

    if (existingPost.length === 0) {
      throw new Error("Blog post not found");
    }

    // Delete image if exists
    if (existingPost[0].image_path) {
      try {
        const filePath = path.join(
          process.cwd(),
          "public",
          existingPost[0].image_path
        );
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    // Delete from database
    await query("DELETE FROM blog_posts WHERE id = ?", [id]);

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}
