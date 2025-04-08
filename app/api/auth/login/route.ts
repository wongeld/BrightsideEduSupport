import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import crypto from "crypto";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Simple token generation function duplicated here for client-side use
function generateToken(user: any): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day expiration
  };

  const tokenString = JSON.stringify(payload);
  const base64Token = Buffer.from(tokenString).toString("base64");

  // Create a signature
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(base64Token)
    .digest("hex");

  return `${base64Token}.${signature}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const result = await login(username, password);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 401 });
    }

    // Generate token for client-side use
    const token = generateToken(result.user);

    return NextResponse.json({
      success: true,
      user: result.user,
      token: token, // Include the token in the response
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
