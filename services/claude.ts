import { env, isConfigured } from "@/lib/env";
import type { ChatMessage } from "@/types/travio";

export const CLAUDE_MODEL = "claude-sonnet-4-20250514";

export const TRAVIO_SYSTEM_PROMPT = [
  "You are Travio, a smart AI shopping companion.",
  "You help users find products, compare prices and make better shopping decisions.",
  "You respond naturally and conversationally like a knowledgeable friend.",
  "You NEVER say 'I am searching on Amazon' or 'I am looking on Alibaba'.",
  "You just naturally recommend products with prices and where to buy.",
  "You are helpful, concise and smart.",
].join(" ");

interface ClaudeContentBlock {
  type: string;
  text?: string;
}

function toClaudeMessages(history: ChatMessage[]) {
  return history
    .filter((message) => message.content.trim().length > 0)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

function demoReply(history: ChatMessage[]): string {
  const last = history[history.length - 1]?.content ?? "";
  if (!last) {
    return "Hi! I'm Travio. Tell me what you're shopping for and I'll find the best options for you.";
  }
  return [
    `Great choice exploring ${last.trim()}. Here's how I'd think about it:`,
    "look for strong reviews, a fair price, and fast shipping.",
    "Tell me your budget and I'll narrow it down to the best picks for you.",
  ].join(" ");
}

export async function askTravio(history: ChatMessage[]): Promise<string> {
  if (!isConfigured(env.claudeApiKey)) {
    return demoReply(history);
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.claudeApiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      temperature: 0.7,
      system: TRAVIO_SYSTEM_PROMPT,
      messages: toClaudeMessages(history),
    }),
  });

  if (!response.ok) {
    return demoReply(history);
  }

  const json = (await response.json()) as { content?: ClaudeContentBlock[] };
  const text = (json.content ?? [])
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n")
    .trim();

  return text || demoReply(history);
}
