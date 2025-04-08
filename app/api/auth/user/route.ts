import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Log all cookies for debugging
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    console.log(
      "All cookies:",
      allCookies.map((c) => ({
        name: c.name,
        value: c.value ? c.value.substring(0, 10) + "..." : "empty",
      }))
    );

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "An error occurred while getting user information" },
      { status: 500 }
    );
  }
}
