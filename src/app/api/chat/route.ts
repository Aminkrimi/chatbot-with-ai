import { z } from "zod";
import { chatRequestSchema } from "@/core/chat/schema";
import { normalizeError } from "@/core/llm/errors";
import { errorResponse, sseResponse } from "@/core/llm/sseResponse";
import { openChatStream } from "@/core/llm/streamChat";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse({ status: 400, code: "invalid_request", message: "Body must be valid JSON." });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse({ status: 400, code: "invalid_request", message: z.prettifyError(parsed.error) });
  }

  try {
    // request.signal aborts when the browser disconnects; the SDK then cancels the upstream call.
    const events = await openChatStream(parsed.data, request.signal);
    return sseResponse(events, request.signal);
  } catch (error) {
    const normalized = normalizeError(error);
    console.error(`[chat] request failed (${normalized.status} ${normalized.code})`, error);
    return errorResponse(normalized);
  }
}
