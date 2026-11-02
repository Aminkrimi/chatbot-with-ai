import assert from "node:assert/strict";
import { test } from "node:test";
import { detectDirection } from "./textDirection.ts";

test("a Persian sentence that opens with English stays RTL", () => {
  assert.equal(detectDirection("React یک کتابخانهٔ جاوااسکریپت برای ساخت UI است."), "rtl");
  assert.equal(detectDirection("useEffect برای side effect ها استفاده می‌شود."), "rtl");
  assert.equal(detectDirection("برای state management از Redux Toolkit یا Zustand استفاده کن."), "rtl");
});

test("English text is LTR, even when it quotes a little Persian", () => {
  assert.equal(detectDirection("This paragraph is fully English."), "ltr");
  assert.equal(detectDirection("The user wrote 'سلام خوبی' and wants a short friendly greeting back."), "ltr");
});

test("no letters falls back", () => {
  assert.equal(detectDirection(""), "rtl");
  assert.equal(detectDirection("123 — 456", "ltr"), "ltr");
});
