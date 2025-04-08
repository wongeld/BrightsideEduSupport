import mysql from "mysql2/promise";
import crypto from "crypto";

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "brightside",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Initialize database tables if they don't exist
export async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Create users table
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

    // Create news table with shorter slug length
    await query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_am VARCHAR(255),
        slug VARCHAR(100) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        content_am TEXT,
        excerpt VARCHAR(255),
        excerpt_am VARCHAR(255),
        image_path VARCHAR(255),
        published BOOLEAN DEFAULT FALSE,
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create blog posts table with shorter slug length
    await query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_am VARCHAR(255),
        slug VARCHAR(100) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        content_am TEXT,
        excerpt VARCHAR(255),
        excerpt_am VARCHAR(255),
        image_path VARCHAR(255),
        published BOOLEAN DEFAULT FALSE,
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create vacancies table with shorter slug length
    await query(`
      CREATE TABLE IF NOT EXISTS vacancies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_am VARCHAR(255),
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        description_am TEXT,
        requirements TEXT,
        requirements_am TEXT,
        location VARCHAR(100),
        location_am VARCHAR(100),
        type VARCHAR(50),
        type_am VARCHAR(50),
        google_form_link VARCHAR(255),
        deadline DATE,
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create testimonials table
    await query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        name_am VARCHAR(100),
        role VARCHAR(100),
        role_am VARCHAR(100),
        content TEXT NOT NULL,
        content_am TEXT,
        image_path VARCHAR(255),
        display_order INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create partners table
    await query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        name_am VARCHAR(100),
        logo_path VARCHAR(255) NOT NULL,
        website_url VARCHAR(255),
        display_order INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user if not exists
    const adminExists = await query("SELECT id FROM users WHERE username = ?", [
      "admin",
    ]);
    if (Array.isArray(adminExists) && adminExists.length === 0) {
      // Hash the password using our simple method
      const hashedPassword = crypto
        .createHash("sha256")
        .update("admin123" + (process.env.JWT_SECRET || "your-secret-key"))
        .digest("hex");

      await query(
        "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
        ["admin", hashedPassword, "admin@brightside.edu.et", "admin"]
      );
      console.log("Default admin user created");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}
