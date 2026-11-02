import { ArrowDown } from "lucide-react";

export function ScrollToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="رفتن به آخرین پیام"
      title="رفتن به آخرین پیام"
      className="absolute bottom-3 left-1/2 inline-flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-lg transition-colors hover:text-fg"
    >
      <ArrowDown aria-hidden className="size-4" />
    </button>
  );
}
