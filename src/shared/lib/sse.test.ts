import assert from "node:assert/strict";
import { test } from "node:test";
import { formatSSE, readSSE } from "./sse.ts";

function streamOf(chunks: Iterable<Uint8Array | string>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(typeof chunk === "string" ? encoder.encode(chunk) : chunk);
      controller.close();
    },
  });
}

async function collect(stream: ReadableStream<Uint8Array>): Promise<string[]> {
  const out: string[] = [];
  for await (const data of readSSE(stream)) out.push(data);
  return out;
}

test("splits events at any byte boundary, including inside multi-byte characters", async () => {
  const wire = formatSSE('{"a":1}') + formatSSE("line1\nline2") + ": comment\n\n" + formatSSE("سلام");
  const oneBytePerChunk = Array.from(new TextEncoder().encode(wire), (b) => new Uint8Array([b]));
  assert.deepEqual(await collect(streamOf(oneBytePerChunk)), ['{"a":1}', "line1\nline2", "سلام"]);
});

test("handles a CRLF split across chunks and drops an unterminated tail", async () => {
  const chunks = ["data: x\r", "\n\r\n", "data: y\r\n\r\n", "data: partial"];
  assert.deepEqual(await collect(streamOf(chunks)), ["x", "y"]);
});
