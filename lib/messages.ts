import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function getAllMessages(unreadOnly = false) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    let sql = "SELECT * FROM messages";
    const params: any[] = [];

    if (unreadOnly) {
      sql += " WHERE is_read = ?";
      params.push(false);
    }

    sql += " ORDER BY created_at DESC";

    const results = (await query(sql, params)) as Message[];
    return results;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function getMessageById(id: number) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const results = (await query("SELECT * FROM messages WHERE id = ?", [
      id,
    ])) as Message[];

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    throw error;
  }
}

export async function createMessage(messageData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  try {
    const { name, email, phone, subject, message } = messageData;

    // Insert into database
    const result = (await query(
      "INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, subject, message]
    )) as { insertId: number };

    return {
      id: result.insertId,
      name,
      email,
      phone,
      subject,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

export async function markMessageAsRead(id: number, isRead = true) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await query("UPDATE messages SET is_read = ? WHERE id = ?", [isRead, id]);

    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}

export async function deleteMessage(id: number) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await query("DELETE FROM messages WHERE id = ?", [id]);

    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}
