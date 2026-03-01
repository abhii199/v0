import { AgentResult, TextContent, TextMessage } from "@inngest/agent-kit"

export function lastAssistantTextMessage(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  )
  const message = result.output[lastAssistantTextMessageIndex]

  if (!message || message.type !== "text") return undefined
  const textMessage = message as TextMessage
  return typeof textMessage.content === "string"
    ? textMessage.content
    : (textMessage.content as TextContent[]).map((c) => c.text).join("")
}