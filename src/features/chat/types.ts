import type { ChatErrorPayload } from "@/core/chat/events";

export interface MessageMetrics {
  /** Request sent → first token of any kind (reasoning included). */
  ttftMs?: number;
  /** Request sent → stream finished. */
  totalMs?: number;
  promptTokens?: number;
  completionTokens?: number;
}

export type AssistantStatus = "streaming" | "done" | "stopped" | "error";

export interface UserMessage {
  id: string;
  role: "user";
  content: string;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  content: string;
  reasoning: string;
  /** Set once reasoning ends (first content token, or end of stream). */
  reasoningMs?: number;
  status: AssistantStatus;
  metrics: MessageMetrics;
  error?: ChatErrorPayload;
}

export type ChatMessage = UserMessage | AssistantMessage;

export interface ChatSettings {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  thinking: boolean;
}
