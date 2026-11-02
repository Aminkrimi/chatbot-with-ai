import { z } from "zod";
import { UPSTREAM_ERROR_CODES } from "./errorCodes";

const errorCodeSchema = z.enum([...UPSTREAM_ERROR_CODES, "network_error", "unknown_error"]);

const usageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
});

const errorPayloadSchema = z.object({
  code: errorCodeSchema,
  message: z.string(),
  /** Seconds to wait before retrying, from the upstream `Retry-After` header. */
  retryAfter: z.number().optional(),
});

/**
 * The normalized SSE contract between `/api/chat` and the browser.
 * Each SSE `data:` line carries exactly one of these as JSON; the client
 * validates with this schema instead of trusting the wire.
 */
export const chatEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("reasoning"), text: z.string() }),
  z.object({ type: z.literal("content"), text: z.string() }),
  usageSchema.extend({ type: z.literal("usage") }),
  errorPayloadSchema.extend({ type: z.literal("error") }),
  z.object({ type: z.literal("done") }),
]);

export type ChatEvent = z.infer<typeof chatEventSchema>;
export type ChatErrorPayload = z.infer<typeof errorPayloadSchema>;
export type UsagePayload = z.infer<typeof usageSchema>;
