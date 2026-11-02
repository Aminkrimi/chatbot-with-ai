import { z } from "zod";
import {
  MAX_MAX_TOKENS,
  MAX_MESSAGE_CHARS,
  MAX_MESSAGES,
  MAX_SYSTEM_PROMPT_CHARS,
} from "./limits";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(MAX_MESSAGE_CHARS),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(messageSchema)
    .min(1)
    .max(MAX_MESSAGES)
    .refine((messages) => messages.at(-1)?.role === "user", {
      message: "The last message must come from the user.",
    }),
  systemPrompt: z.string().max(MAX_SYSTEM_PROMPT_CHARS).optional(),
  thinking: z.boolean(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(MAX_MAX_TOKENS).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatRequestMessage = z.infer<typeof messageSchema>;
