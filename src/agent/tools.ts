// src/agent/tools.ts
import Anthropic from "@anthropic-ai/sdk"

export const tools: Anthropic.Tool[] = [
  {
    name: "get_user_balance",
    description: "Get a user's wallet balance",
    input_schema: {
      type: "object" as const,
      properties: {
        userId: {
          type: "string" as const,
          description: "The user's ID"
        }
      },
      required: ["userId"]
    }
  }
]

export async function getUserBalance({ userId }: { userId: string }) {
  return {
    userId,
    balance: 4200
  }
}
