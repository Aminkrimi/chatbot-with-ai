import { ArrowUp, Square } from "lucide-react";

interface SendStopButtonProps {
  isStreaming: boolean;
  canSend: boolean;
  onStop: () => void;
}

/** Submits the composer form; while streaming it becomes a Stop button instead. */
export function SendStopButton({ isStreaming, canSend, onStop }: SendStopButtonProps) {
  const base =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed";

  if (isStreaming) {
    return (
      <button type="button" onClick={onStop} aria-label="توقف" title="توقف" className={`${base} bg-fg text-bg hover:opacity-85`}>
        <Square aria-hidden className="size-3.5 fill-current" />
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={!canSend}
      aria-label="ارسال"
      title="ارسال"
      className={`${base} bg-accent text-accent-fg hover:opacity-90 disabled:bg-surface-2 disabled:text-muted`}
    >
      <ArrowUp aria-hidden className="size-[18px]" />
    </button>
  );
}
