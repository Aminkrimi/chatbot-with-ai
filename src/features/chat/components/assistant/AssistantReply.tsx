import { RotateCw } from "lucide-react";
import { CopyButton } from "@/shared/ui/CopyButton";
import { IconButton } from "@/shared/ui/IconButton";
import type { AssistantMessage } from "../../types";
import { ErrorNotice } from "./ErrorNotice";
import { MarkdownContent } from "./MarkdownContent";
import { MetricsBar } from "./MetricsBar";
import { StreamingDots } from "./StreamingDots";
import { ThinkingPanel } from "./ThinkingPanel";

interface AssistantReplyProps {
  message: AssistantMessage;
  /** Only the latest reply can be retried. */
  onRetry?: () => void;
  onNewChat: () => void;
}

export function AssistantReply({ message, onRetry, onNewChat }: AssistantReplyProps) {
  const { content, reasoning, reasoningMs, status, metrics, error } = message;
  const streaming = status === "streaming";
  const isThinking = streaming && reasoning !== "" && reasoningMs === undefined;

  return (
    <article className="flex flex-col gap-3" aria-busy={streaming}>
      {reasoning && <ThinkingPanel reasoning={reasoning} isThinking={isThinking} reasoningMs={reasoningMs} />}

      {content && <MarkdownContent content={content} />}
      {streaming && !content && !reasoning && <StreamingDots />}

      {status === "stopped" && <p className="text-xs text-muted">پاسخ متوقف شد.</p>}
      {status === "error" && error && <ErrorNotice error={error} onRetry={onRetry} onNewChat={onNewChat} />}

      {!streaming && (
        <footer className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {content && <CopyButton label="کپی پاسخ" getText={() => content} />}
          {onRetry && status === "stopped" && (
            <IconButton size="sm" label="تلاش دوباره" onClick={onRetry}>
              <RotateCw aria-hidden />
            </IconButton>
          )}
          <MetricsBar metrics={metrics} />
        </footer>
      )}
    </article>
  );
}
