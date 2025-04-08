import { NextResponse } from "next/server"
import { createMessage } from "@/lib/messages"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Create message in database
    const result = await createMessage({
      name,
      email,
      phone,
      subject,
      message,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}

