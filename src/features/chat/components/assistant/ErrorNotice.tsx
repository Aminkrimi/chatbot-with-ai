import { RotateCw, SquarePen, TriangleAlert } from "lucide-react";
import type { ChatErrorPayload } from "@/core/chat/events";
import { useCountdown } from "@/shared/hooks/useCountdown";
import { ERROR_COPY } from "../../errors";
import { formatInteger } from "../../format";
import { NoticeButton } from "./NoticeButton";

interface ErrorNoticeProps {
  error: ChatErrorPayload;
  /** Absent on older replies: only the latest turn can be retried. */
  onRetry?: () => void;
  onNewChat: () => void;
}

export function ErrorNotice({ error, onRetry, onNewChat }: ErrorNoticeProps) {
  const copy = ERROR_COPY[error.code];
  const wait = useCountdown(error.retryAfter ?? 0);

  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger-soft p-3.5">
      <TriangleAlert aria-hidden className="mt-0.5 size-[18px] shrink-0 text-danger" />
      <div className="flex min-w-0 flex-col gap-2.5">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">{copy.title}</p>
          {copy.hint && <p className="text-xs leading-6 text-muted">{copy.hint}</p>}
          <code dir="ltr" title={error.message} className="self-end truncate font-mono text-[10px] text-muted/80">
            {error.code}
          </code>
        </div>
        {copy.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {copy.actions.map((action, i) =>
              action === "new_chat" ? (
                <NoticeButton key={action} primary={i === 0} onClick={onNewChat}>
                  <SquarePen aria-hidden />
                  شروع گفتگوی جدید
                </NoticeButton>
              ) : (
                onRetry && (
                  <NoticeButton key={action} primary={i === 0} onClick={onRetry} disabled={wait > 0}>
                    <RotateCw aria-hidden />
                    {wait > 0 ? `تلاش دوباره (${formatInteger(wait)})` : "تلاش دوباره"}
                  </NoticeButton>
                )
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
