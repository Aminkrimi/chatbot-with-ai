import { chatEventSchema, type ChatEvent } from "@/core/chat/events";
import type { ChatRequest } from "@/core/chat/schema";
import { readSSE } from "@/shared/lib/sse";

type ErrorEvent = Extract<ChatEvent, { type: "error" }>;

/**
 * POSTs to the proxy and yields normalized events. HTTP-level failures are
 * yielded as an `error` event too, so callers handle one shape. Aborting
 * `signal` rejects the iteration with an AbortError.
 */
export async function* streamChat(request: ChatRequest, signal: AbortSignal): AsyncGenerator<ChatEvent> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok || !response.body) {
    yield await readErrorResponse(response);
    return;
  }

  for await (const data of readSSE(response.body)) {
    const parsed = chatEventSchema.safeParse(safeJson(data));
    if (parsed.success) yield parsed.data;
  }
}

async function readErrorResponse(response: Response): Promise<ErrorEvent> {
  const parsed = chatEventSchema.safeParse(safeJson(await response.text().catch(() => "")));
  if (parsed.success && parsed.data.type === "error") return parsed.data;

  const retryAfter = Number(response.headers.get("retry-after"));
  return {
    type: "error",
    code: "unknown_error",
    message: `HTTP ${response.status}`,
    ...(Number.isFinite(retryAfter) && retryAfter > 0 && { retryAfter }),
  };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
