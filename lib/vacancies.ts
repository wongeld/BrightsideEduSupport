import { query } from "@/lib/db"
import { slugify } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"

export interface Vacancy {
  id: number
  title: string
  title_am?: string
  slug: string
  description: string
  description_am?: string
  requirements?: string
  requirements_am?: string
  location?: string
  location_am?: string
  type?: string
  type_am?: string
  google_form_link?: string
  deadline?: string
  published: boolean
  created_at: string
  updated_at: string
}

export async function getAllVacancies(language = "en", limit?: number, publishedOnly = true) {
  try {
    let sql = `
      SELECT 
        id, 
        ${language === "en" ? "title" : "COALESCE(title_am, title) as title"}, 
        slug, 
        ${language === "en" ? "location" : "COALESCE(location_am, location) as location"}, 
        ${language === "en" ? "type" : "COALESCE(type_am, type) as type"}, 
        deadline, 
        published, 
        created_at, 
        updated_at 
      FROM vacancies
    `

    const params: any[] = []

    if (publishedOnly) {
      sql += " WHERE published = ?"
      params.push(true)

      // Only show active vacancies (deadline in the future or null)
      sql += " AND (deadline IS NULL OR deadline >= CURDATE())"
    }

    sql += " ORDER BY created_at DESC"

    if (limit) {
      sql += " LIMIT ?"
      params.push(limit)
    }

    const results = (await query(sql, params)) as Vacancy[]
    return results
  } catch (error) {
    console.error("Error fetching vacancies:", error)
    throw error
  }
}

export async function getVacancyById(slug: string, language = "en") {
  try {
    const sql = `
      SELECT 
        id, 
        ${language === "en" ? "title" : "COALESCE(title_am, title) as title"}, 
        slug, 
        ${language === "en" ? "description" : "COALESCE(description_am, description) as description"}, 
        ${language === "en" ? "requirements" : "COALESCE(requirements_am, requirements) as requirements"}, 
        ${language === "en" ? "location" : "COALESCE(location_am, location) as location"}, 
        
        ${language === "en" ? "location" : "COALESCE(location_am, location) as location"}, 
        ${language === "en" ? "type" : "COALESCE(type_am, type) as type"}, 
        google_form_link, 
        deadline, 
        published, 
        created_at, 
        updated_at 
      FROM vacancies 
      WHERE slug = ?
    `

    const results = (await query(sql, [slug])) as Vacancy[]

    if (results.length === 0) {
      return null
    }

    return results[0]
  } catch (error) {
    console.error("Error fetching vacancy by ID:", error)
    throw error
  }
}

export async function createVacancy(vacancyData: {
  title: string
  title_am?: string
  description: string
  description_am?: string
  requirements?: string
  requirements_am?: string
  location?: string
  location_am?: string
  type?: string
  type_am?: string
  google_form_link?: string
  deadline?: string
  published?: boolean
}) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const {
      title,
      title_am,
      description,
      description_am,
      requirements,
      requirements_am,
      location,
      location_am,
      type,
      type_am,
      google_form_link,
      deadline,
      published = false,
    } = vacancyData

    // Generate slug from title
    const slug = slugify(title)

    // Insert into database
    const result = (await query(
      `INSERT INTO vacancies 
        (title, title_am, slug, description, description_am, requirements, requirements_am, 
         location, location_am, type, type_am, google_form_link, deadline, published) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        title_am,
        slug,
        description,
        description_am,
        requirements,
        requirements_am,
        location,
        location_am,
        type,
        type_am,
        google_form_link,
        deadline,
        published,
      ],
    )) as { insertId: number }

    return {
      id: result.insertId,
      title,
      title_am,
      slug,
      description,
      description_am,
      requirements,
      requirements_am,
      location,
      location_am,
      type,
      type_am,
      google_form_link,
      deadline,
      published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error creating vacancy:", error)
    throw error
  }
}

export async function updateVacancy(
  id: number,
  vacancyData: {
    title?: string
    title_am?: string
    description?: string
    description_am?: string
    requirements?: string
    requirements_am?: string
    location?: string
    location_am?: string
    type?: string
    type_am?: string
    google_form_link?: string
    deadline?: string
    published?: boolean
  },
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get existing vacancy
    const existingVacancy = (await query("SELECT * FROM vacancies WHERE id = ?", [id])) as Vacancy[]

    if (existingVacancy.length === 0) {
      throw new Error("Vacancy not found")
    }

    const current = existingVacancy[0]

    // Prepare update data
    const {
      title = current.title,
      title_am = current.title_am,
      description = current.description,
      description_am = current.description_am,
      requirements = current.requirements,
      requirements_am = current.requirements_am,
      location = current.location,
      location_am = current.location_am,
      type = current.type,
      type_am = current.type_am,
      google_form_link = current.google_form_link,
      deadline = current.deadline,
      published = current.published,
    } = vacancyData

    // Generate new slug if title changed
    const slug = title !== current.title ? slugify(title) : current.slug

    // Update in database
    await query(
      `UPDATE vacancies 
       SET title = ?, title_am = ?, slug = ?, description = ?, description_am = ?, 
           requirements = ?, requirements_am = ?, location = ?, location_am = ?, 
           type = ?, type_am = ?, google_form_link = ?, deadline = ?, published = ? 
       WHERE id = ?`,
      [
        title,
        title_am,
        slug,
        description,
        description_am,
        requirements,
        requirements_am,
        location,
        location_am,
        type,
        type_am,
        google_form_link,
        deadline,
        published,
        id,
      ],
    )

    return {
      id,
      title,
      title_am,
      slug,
      description,
      description_am,
      requirements,
      requirements_am,
      location,
      location_am,
      type,
      type_am,
      google_form_link,
      deadline,
      published,
      created_at: current.created_at,
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error updating vacancy:", error)
    throw error
  }
}

export async function deleteVacancy(id: number) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Delete from database
    await query("DELETE FROM vacancies WHERE id = ?", [id])

    return { success: true }
  } catch (error) {
    console.error("Error deleting vacancy:", error)
    throw error
  }
}

