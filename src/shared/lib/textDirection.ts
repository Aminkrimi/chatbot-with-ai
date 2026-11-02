export type TextDirection = "rtl" | "ltr";

const RTL_LETTER = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
const LATIN_LETTER = /[A-Za-z]/;

/** Long texts are judged by their opening; also keeps the cost flat while a reply streams. */
const SAMPLE_CHARS = 1000;

/**
 * Direction for a block of mixed Persian/English text.
 *
 * `dir="auto"` lets the first strong character decide, so a Persian sentence that opens
 * with an English term ("React یک کتابخانه است.") flips to LTR and its punctuation jumps
 * sides. Here words are counted instead, biased toward RTL: a block is LTR only when Latin
 * words outnumber RTL words more than two to one. No letters at all → `fallback`.
 */
export function detectDirection(text: string, fallback: TextDirection = "rtl"): TextDirection {
  let rtl = 0;
  let ltr = 0;
  for (const word of text.slice(0, SAMPLE_CHARS).split(/\s+/)) {
    if (RTL_LETTER.test(word)) rtl++;
    else if (LATIN_LETTER.test(word)) ltr++;
  }
  if (rtl === 0 && ltr === 0) return fallback;
  return ltr > rtl * 2 ? "ltr" : "rtl";
}
