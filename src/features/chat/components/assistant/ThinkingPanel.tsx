import { Brain, ChevronDown } from "lucide-react";
import { detectDirection } from "@/shared/lib/textDirection";
import { formatWholeSeconds } from "../../format";

interface ThinkingPanelProps {
  reasoning: string;
  /** True while reasoning tokens are still arriving. */
  isThinking: boolean;
  reasoningMs?: number;
}

/** Collapsed by default, including while thinking; the header alone shows progress. */
export function ThinkingPanel({ reasoning, isThinking, reasoningMs }: ThinkingPanelProps) {
  const title = isThinking
    ? "در حال فکر کردن…"
    : reasoningMs !== undefined
      ? `فکر کرد برای ${formatWholeSeconds(reasoningMs)} ثانیه`
      : "فرایند تفکر";

  return (
    <details className="group rounded-xl border border-border bg-surface/60">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted select-none hover:text-fg [&::-webkit-details-marker]:hidden">
        <Brain aria-hidden className={`size-4 ${isThinking ? "animate-pulse text-accent" : ""}`} />
        <span className={isThinking ? "animate-pulse" : ""}>{title}</span>
        <ChevronDown aria-hidden className="ms-auto size-4 transition-transform group-open:rotate-180" />
      </summary>
      <p
        dir={detectDirection(reasoning)}
        aria-live={isThinking ? "polite" : undefined}
        className="border-t border-border px-4 py-3 text-[13px] leading-7 whitespace-pre-wrap text-muted"
      >
        {reasoning}
      </p>
    </details>
  );
}
