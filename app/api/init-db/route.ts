import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    // Check if users table exists
    try {
      await query("SELECT 1 FROM users LIMIT 1");
      console.log("Users table exists");
    } catch (error) {
      console.log("Creating users table...");
      // Create users table if it doesn't exist
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100) NOT NULL,
          role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    // Check if admin user exists
    const adminExists = await query("SELECT id FROM users WHERE username = ?", [
      "admin",
    ]);

    if (Array.isArray(adminExists) && adminExists.length === 0) {
      console.log("Creating admin user...");
      // Hash the password using our simple method
      const hashedPassword = crypto
        .createHash("sha256")
        .update("admin123" + SECRET_KEY)
        .digest("hex");

      await query(
        "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
        ["admin", hashedPassword, "admin@brightside.edu.et", "admin"]
      );

      return NextResponse.json({
        success: true,
        message: "Admin user created successfully",
        credentials: {
          username: "admin",
          password: "admin123",
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        credentials: {
          username: "admin",
          password: "admin123",
        },
      });
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      {
        error: "Failed to create admin user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
