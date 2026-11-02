/** Error codes the upstream API documents. Branch on these, never on message text. */
export const UPSTREAM_ERROR_CODES = [
  "invalid_api_key",
  "model_not_allowed",
  "ip_not_allowed",
  "model_not_found",
  "context_length_exceeded",
  "invalid_request",
  "rate_limited",
  "quota_exceeded",
  "upstream_error",
  "model_maintenance",
  "model_unavailable",
  "upstream_timeout",
] as const;

export type UpstreamErrorCode = (typeof UPSTREAM_ERROR_CODES)[number];

/** Upstream codes plus the ones this app produces itself. */
export type ErrorCode = UpstreamErrorCode | "network_error" | "unknown_error";

export function isUpstreamErrorCode(value: unknown): value is UpstreamErrorCode {
  return typeof value === "string" && (UPSTREAM_ERROR_CODES as readonly string[]).includes(value);
}
