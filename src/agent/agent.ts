// src/agent/agent.ts
import Anthropic from "@anthropic-ai/sdk"
import dotenv from "dotenv"
import { tools, getUserBalance } from "./tools"
import { saveMemory, loadRecentMemory } from "./memory"

// Ensure environment variables are loaded
dotenv.config()

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export async function runAgent(userId: string, userMessage: string): Promise<string> {
  const memory = await loadRecentMemory(userId)

  // Build messages array with proper types
  const messages: Anthropic.MessageParam[] = [
    ...memory.map((m): Anthropic.MessageParam => ({
      role: "assistant" as const,
      content: m
    })),
    {
      role: "user" as const,
      content: userMessage
    }
  ]

  const response = await claude.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 500,
    system: "You are a helpful financial assistant.",
    messages,
    tools
  })

  const msg = response.content[0]

  // Tool call?
  if (msg.type === "tool_use") {
    if (msg.name === "get_user_balance") {
      const result = await getUserBalance(msg.input as { userId: string })

      const followUp = await claude.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        system: "You are a helpful financial assistant.",
        messages: [
          ...messages,
          {
            role: "assistant" as const,
            content: response.content
          },
          {
            role: "user" as const,
            content: [
              {
                type: "tool_result" as const,
                tool_use_id: msg.id,
                content: JSON.stringify(result)
              }
            ]
          }
        ],
        tools
      })

      const finalContent = followUp.content[0]
      if (finalContent.type === "text") {
        await saveMemory(userId, finalContent.text)
        return finalContent.text
      }
      throw new Error("Unexpected response type")
    }
  }

  // Handle text response
  if (msg.type === "text") {
    await saveMemory(userId, msg.text)
    return msg.text
  }

  throw new Error("Unexpected message type")
}
