import "server-only";
import { APIConnectionError, APIConnectionTimeoutError, APIError } from "openai";
import { isUpstreamErrorCode } from "@/core/chat/errorCodes";
import type { ChatErrorPayload } from "@/core/chat/events";

export interface NormalizedError extends ChatErrorPayload {
  status: number;
}

/** Maps anything thrown by the SDK (or by us) to the app's error contract. */
export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof APIConnectionTimeoutError) {
    return { status: 504, code: "upstream_timeout", message: "The model API timed out." };
  }
  if (error instanceof APIConnectionError) {
    return { status: 502, code: "upstream_error", message: "Could not reach the model API." };
  }
  if (error instanceof APIError) {
    const retryAfter = parseRetryAfter(error.headers?.get("retry-after") ?? null);
    return {
      status: error.status ?? 502,
      code: isUpstreamErrorCode(error.code) ? error.code : "unknown_error",
      message: error.message,
      ...(retryAfter !== undefined && { retryAfter }),
    };
  }
  // Our own bugs or misconfiguration: log the details, never send them to the browser.
  return { status: 500, code: "unknown_error", message: "Internal server error." };
}

/** `Retry-After` is either delay-seconds or an HTTP date. */
function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, Math.ceil(seconds));
  const date = Date.parse(header);
  return Number.isNaN(date) ? undefined : Math.max(0, Math.ceil((date - Date.now()) / 1000));
}
