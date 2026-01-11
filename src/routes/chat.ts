// src/routes/chat.ts
import { Router } from "express"
import { runAgent } from "../agent/agent"

const router = Router()

router.post("/", async (req, res) => {
  const { userId, message } = req.body
  const reply = await runAgent(userId, message)
  res.json({ reply })
})

export default router
