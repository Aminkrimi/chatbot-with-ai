/**
 * Reads a `text/event-stream` body and yields the `data` payload of each event.
 * Multi-line `data:` fields are joined with "\n"; comments and other fields are ignored.
 * Breaking out of the loop cancels the underlying stream.
 */
export async function* readSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) return; // an unterminated trailing event is discarded, per the SSE spec
      // Normalize CRLF/CR to LF, but keep a trailing CR: its LF may arrive in the next chunk.
      buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n|\r(?!$)/g, "\n");
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const raw of events) {
        const data = parseEventData(raw);
        if (data !== null) yield data;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
}

function parseEventData(raw: string): string | null {
  const lines: string[] = [];
  for (const line of raw.split("\n")) {
    if (line === "data") lines.push("");
    else if (line.startsWith("data:")) lines.push(line.slice(line.startsWith("data: ") ? 6 : 5));
  }
  return lines.length > 0 ? lines.join("\n") : null;
}

/** Encodes one SSE event. */
export function formatSSE(data: string): string {
  return `data: ${data.replace(/\n/g, "\ndata: ")}\n\n`;
}
