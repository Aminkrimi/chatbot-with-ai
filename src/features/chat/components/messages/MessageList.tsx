import { useEffect } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import type { ChatMessage } from "../../types";
import { AssistantReply } from "../assistant/AssistantReply";
import { ScrollToBottomButton } from "./ScrollToBottomButton";
import { UserBubble } from "./UserBubble";

interface MessageListProps {
  messages: ChatMessage[];
  onRetry: () => void;
  onNewChat: () => void;
}

export function MessageList({ messages, onRetry, onNewChat }: MessageListProps) {
  const { scrollRef, contentRef, isPinned, scrollToBottom } = useAutoScroll<HTMLDivElement, HTMLOListElement>();

  // Sending a message always jumps to the bottom, even if the user had scrolled up.
  const userTurns = messages.filter((m) => m.role === "user").length;
  useEffect(() => {
    if (userTurns > 0) scrollToBottom("instant");
  }, [userTurns, scrollToBottom]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
        <ol ref={contentRef} aria-label="گفتگو" className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
          {messages.map((message, index) => (
            <li key={message.id}>
              {message.role === "user" ? (
                <UserBubble content={message.content} />
              ) : (
                <AssistantReply
                  message={message}
                  onRetry={index === messages.length - 1 ? onRetry : undefined}
                  onNewChat={onNewChat}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
      {!isPinned && <ScrollToBottomButton onClick={() => scrollToBottom()} />}
    </div>
  );
}
