import { NextResponse } from "next/server"
import { getAllVacancies, getVacancyById, createVacancy, updateVacancy, deleteVacancy } from "@/lib/vacancies"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") || "en"
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const slug = searchParams.get("slug")

    if (slug) {
      const vacancy = await getVacancyById(slug, language as "en" | "am")
      if (!vacancy) {
        return NextResponse.json({ error: "Vacancy not found" }, { status: 404 })
      }
      return NextResponse.json(vacancy)
    }

    const vacancies = await getAllVacancies(language as "en" | "am", limit)
    return NextResponse.json(vacancies)
  } catch (error) {
    console.error("Error fetching vacancies:", error)
    return NextResponse.json({ error: "Failed to fetch vacancies" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
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
    } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const result = await createVacancy({
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
      published,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating vacancy:", error)
    return NextResponse.json({ error: "Failed to create vacancy" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...vacancyData } = body

    if (!id) {
      return NextResponse.json({ error: "Vacancy ID is required" }, { status: 400 })
    }

    const result = await updateVacancy(id, vacancyData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating vacancy:", error)
    return NextResponse.json({ error: "Failed to update vacancy" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Vacancy ID is required" }, { status: 400 })
    }

    const result = await deleteVacancy(Number.parseInt(id))
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting vacancy:", error)
    return NextResponse.json({ error: "Failed to delete vacancy" }, { status: 500 })
  }
}

