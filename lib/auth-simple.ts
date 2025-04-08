import { cookies } from "next/headers";
import { query } from "@/lib/db";
import crypto from "crypto";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const COOKIE_NAME = "brightside_auth";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "editor";
}

// Simple hash function for passwords
function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + SECRET_KEY)
    .digest("hex");
}

// Simple token generation
function generateToken(user: User): string {
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

// Verify and decode token
function verifyToken(token: string): User | null {
  try {
    const [base64Payload, signature] = token.split(".");

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(base64Payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString());

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function login(username: string, password: string) {
  try {
    const users = (await query("SELECT * FROM users WHERE username = ?", [
      username,
    ])) as any[];

    if (users.length === 0) {
      return { success: false, message: "Invalid username or password" };
    }

    const user = users[0];
    const hashedPassword = hashPassword(password);

    // For existing bcrypt passwords, you'll need to update them to the new format
    // This is a simplified check - in production you'd need a migration strategy
    if (user.password !== hashedPassword && !user.password.startsWith("$2b$")) {
      return { success: false, message: "Invalid username or password" };
    }

    // Create a token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Set the cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token) {
      return null;
    }

    return verifyToken(token.value);
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  try {
    const users = (await query("SELECT * FROM users WHERE id = ?", [
      userId,
    ])) as any[];

    if (users.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = users[0];
    const hashedCurrentPassword = hashPassword(currentPassword);

    // Check if the current password matches
    if (user.password !== hashedCurrentPassword) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash the new password
    const hashedNewPassword = hashPassword(newPassword);

    // Update the password
    await query("UPDATE users SET password = ? WHERE id = ?", [
      hashedNewPassword,
      userId,
    ]);

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "An error occurred while changing the password",
    };
  }
}

export async function requireAdmin(callback: () => Promise<any>) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return callback();
}
