import "server-only";
import type { ChatEvent } from "@/core/chat/events";
import { formatSSE } from "@/shared/lib/sse";
import { normalizeError, type NormalizedError } from "./errors";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no", // stop reverse proxies (nginx) from buffering the stream
};

const encoder = new TextEncoder();
const encode = (event: ChatEvent) => encoder.encode(formatSSE(JSON.stringify(event)));

/** Error before streaming started: real HTTP status, same payload shape as the SSE event. */
export function errorResponse({ status, ...payload }: NormalizedError): Response {
  return Response.json(
    { type: "error", ...payload } satisfies ChatEvent,
    {
      status,
      headers: payload.retryAfter !== undefined ? { "Retry-After": String(payload.retryAfter) } : undefined,
    },
  );
}

/**
 * Pull-based, so a chunk is read from upstream only when the client is ready for it
 * (no server-side buffering). Ends with `done`, or with `error` if upstream fails mid-stream.
 */
export function sseResponse(events: AsyncGenerator<ChatEvent>, signal: AbortSignal): Response {
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await events.next();
        if (done) {
          controller.enqueue(encode({ type: "done" }));
          controller.close();
        } else {
          controller.enqueue(encode(value));
        }
      } catch (error) {
        if (signal.aborted) return; // client went away; nobody is listening
        const { status, ...payload } = normalizeError(error);
        console.error(`[chat] stream failed (${status} ${payload.code})`, error);
        controller.enqueue(encode({ type: "error", ...payload }));
        controller.close();
      }
    },
    async cancel() {
      await events.return(undefined);
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
