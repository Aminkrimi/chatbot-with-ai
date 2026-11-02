import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { detectDirection } from "@/shared/lib/textDirection";
import { SendStopButton } from "./SendStopButton";
import { ThinkingToggle } from "./ThinkingToggle";

interface ComposerProps {
  isStreaming: boolean;
  thinking: boolean;
  onThinkingChange: (enabled: boolean) => void;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function Composer({ isStreaming, thinking, onThinkingChange, onSend, onStop }: ComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = text.trim() !== "" && !isStreaming;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!canSend) return;
    onSend(text);
    setText("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // isComposing: Enter that confirms an IME candidate must not send.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="rounded-2xl border border-border bg-surface shadow-sm transition-colors focus-within:border-border-strong">
        <label htmlFor="composer" className="sr-only">
          پیام
        </label>
        <textarea
          id="composer"
          ref={textareaRef}
          dir={detectDirection(text)}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="پیام خود را بنویسید…"
          aria-describedby="composer-hint"
          className="block max-h-52 min-h-14 w-full resize-none bg-transparent px-4 pt-3.5 text-[15px] leading-7 field-sizing-content placeholder:text-muted focus-visible:outline-none"
        />
        <div className="flex items-center justify-between gap-2 p-2">
          <ThinkingToggle enabled={thinking} onChange={onThinkingChange} />
          <div className="flex items-center gap-3">
            <span id="composer-hint" className="hidden text-[11px] text-muted sm:inline">
              Enter ارسال · Shift+Enter خط جدید
            </span>
            <SendStopButton isStreaming={isStreaming} canSend={canSend} onStop={onStop} />
          </div>
        </div>
      </div>
    </form>
  );
}
