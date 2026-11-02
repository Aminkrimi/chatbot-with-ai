"use client";

import { useState } from "react";
import { Composer } from "./components/composer/Composer";
import { ContextTrimNotice } from "./components/composer/ContextTrimNotice";
import { ChatHeader } from "./components/header/ChatHeader";
import { EmptyState } from "./components/empty/EmptyState";
import { MessageList } from "./components/messages/MessageList";
import { SettingsDrawer } from "./components/settings/SettingsDrawer";
import { useChat } from "./hooks/useChat";
import { useChatSettings } from "./hooks/useChatSettings";

export function ChatPage() {
  const { settings, update } = useChatSettings();
  const { messages, isStreaming, droppedCount, send, retry, stop, reset } = useChat(settings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col">
      <ChatHeader onNewChat={reset} onOpenSettings={() => setSettingsOpen(true)} canStartNew={messages.length > 0} />
      <main className="flex min-h-0 flex-1 flex-col">
        {messages.length === 0 ? (
          <EmptyState onSelect={send} />
        ) : (
          <MessageList messages={messages} onRetry={retry} onNewChat={reset} />
        )}
        {droppedCount > 0 && messages.length > 0 && <ContextTrimNotice dropped={droppedCount} />}
        <Composer
          isStreaming={isStreaming}
          thinking={settings.thinking}
          onThinkingChange={(enabled) => update("thinking", enabled)}
          onSend={send}
          onStop={stop}
        />
      </main>
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={update}
        onNewChat={reset}
      />
    </div>
  );
}
