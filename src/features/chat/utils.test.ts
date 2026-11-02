import assert from "node:assert/strict";
import { test } from "node:test";
import { tokensPerSecond, trimHistory } from "./utils.ts";

const msg = (role: "user" | "assistant", chars: number) => ({ role, content: "x".repeat(chars) });

test("trimHistory drops oldest turns, keeps the newest, never starts with assistant", () => {
  // 300 chars ≈ 104 tokens each, the last ≈ 14.
  const history = [msg("user", 300), msg("assistant", 300), msg("user", 300), msg("assistant", 300), msg("user", 30)];

  assert.equal(trimHistory(history, 10_000).dropped, 0);

  const { kept, dropped } = trimHistory(history, 250);
  assert.equal(dropped, 2);
  assert.equal(kept[0].role, "user");

  // The newest message survives even when it alone is over budget.
  assert.deepEqual(trimHistory(history, 1).kept, [history[4]]);
});

test("tokensPerSecond measures from the first token", () => {
  assert.equal(tokensPerSecond({ ttftMs: 1000, totalMs: 3000, completionTokens: 100 }), 50);
  assert.equal(tokensPerSecond({ ttftMs: 1000, totalMs: 1000, completionTokens: 100 }), undefined);
  assert.equal(tokensPerSecond({}), undefined);
});
