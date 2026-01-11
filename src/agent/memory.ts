// src/agent/memory.ts

import pool from "../../db"

 

export async function saveMemory(userId: string, content: string) {
  await pool.query(
    "INSERT INTO memories (user_id, content) VALUES ($1, $2)",
    [userId, content]
  )
}

export async function loadRecentMemory(userId: string) {
  const res = await pool.query(
    "SELECT content FROM memories WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5",
    [userId]
  )
  return res.rows.map(r => r.content)
}
