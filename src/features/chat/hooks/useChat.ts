import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatErrorPayload } from "@/core/chat/events";
import { CONTEXT_WINDOW_TOKENS, effectiveMaxTokens } from "@/core/chat/limits";
import type { ChatRequest } from "@/core/chat/schema";
import { streamChat } from "../api";
import { CONTEXT_SAFETY_MARGIN_TOKENS } from "../constants";
import type { AssistantMessage, ChatMessage, ChatSettings } from "../types";
import { createId, estimateTokens, trimHistory } from "../utils";

const CONNECTION_LOST: ChatErrorPayload = { code: "network_error", message: "Stream ended unexpectedly." };

/** Wire history: failed/empty assistant turns are skipped, partial (stopped) ones are kept. */
function toWireMessages(history: readonly ChatMessage[]): ChatRequest["messages"] {
  return history
    .filter((m) => m.content.trim() !== "")
    .map(({ role, content }) => ({ role, content }));
}

function buildRequest(history: readonly ChatMessage[], settings: ChatSettings) {
  const maxTokens = effectiveMaxTokens(settings.maxTokens, settings.thinking);
  const budget =
    CONTEXT_WINDOW_TOKENS -
    maxTokens -
    (settings.systemPrompt ? estimateTokens(settings.systemPrompt) : 0) -
    CONTEXT_SAFETY_MARGIN_TOKENS;
  const { kept, dropped } = trimHistory(toWireMessages(history), budget);

  const request: ChatRequest = {
    messages: kept,
    systemPrompt: settings.systemPrompt || undefined,
    thinking: settings.thinking,
    temperature: settings.temperature,
    maxTokens,
  };
  return { request, dropped };
}

export function useChat(settings: ChatSettings) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  /** How many old messages the last request had to leave out to fit the context window. */
  const [droppedCount, setDroppedCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Read at send time, so a callback created earlier never streams with stale settings.
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async (history: ChatMessage[]) => {
    const { request, dropped } = buildRequest(history, settingsRef.current);
    setDroppedCount(dropped);

    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    let draft: AssistantMessage = {
      id: createId(),
      role: "assistant",
      content: "",
      reasoning: "",
      status: "streaming",
      metrics: {},
    };
    setMessages([...history, draft]);

    // ponytail: one state update per token; batch per animation frame if long answers get janky.
    const commit = (patch: Partial<AssistantMessage>) => {
      draft = { ...draft, ...patch, metrics: { ...draft.metrics, ...patch.metrics } };
      const snapshot = draft;
      setMessages((prev) => prev.map((m) => (m.id === snapshot.id ? snapshot : m)));
    };

    const startedAt = performance.now();
    const elapsed = () => Math.round(performance.now() - startedAt);
    let reasoningStartedAt: number | undefined;
    const reasoningDone = () =>
      reasoningStartedAt !== undefined && draft.reasoningMs === undefined
        ? { reasoningMs: elapsed() - reasoningStartedAt }
        : {};
    const firstToken = () => (draft.metrics.ttftMs === undefined ? { ttftMs: elapsed() } : {});

    try {
      for await (const event of streamChat(request, controller.signal)) {
        switch (event.type) {
          case "reasoning":
            reasoningStartedAt ??= elapsed();
            commit({ reasoning: draft.reasoning + event.text, metrics: firstToken() });
            break;
          case "content":
            commit({ ...reasoningDone(), content: draft.content + event.text, metrics: firstToken() });
            break;
          case "usage":
            commit({
              metrics: { promptTokens: event.prompt_tokens, completionTokens: event.completion_tokens },
            });
            break;
          case "error":
            commit({
              ...reasoningDone(),
              status: "error",
              error: { code: event.code, message: event.message, retryAfter: event.retryAfter },
              metrics: { totalMs: elapsed() },
            });
            return;
          case "done":
            commit({ ...reasoningDone(), status: "done", metrics: { totalMs: elapsed() } });
            return;
        }
      }
      commit({ ...reasoningDone(), status: "error", error: CONNECTION_LOST, metrics: { totalMs: elapsed() } });
    } catch (error) {
      const stopped = controller.signal.aborted;
      if (!stopped) console.error("[chat] stream failed", error);
      commit({
        ...reasoningDone(),
        status: stopped ? "stopped" : "error",
        error: stopped ? undefined : { code: "network_error", message: String(error) },
        metrics: { totalMs: elapsed() },
      });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsStreaming(false);
      }
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || abortRef.current) return;
      void run([...messages, { id: createId(), role: "user", content }]);
    },
    [messages, run],
  );

  /** Re-runs the last user turn, replacing the assistant answer that followed it. */
  const retry = useCallback(() => {
    if (abortRef.current) return;
    const lastUser = messages.findLastIndex((m) => m.role === "user");
    if (lastUser !== -1) void run(messages.slice(0, lastUser + 1));
  }, [messages, run]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setDroppedCount(0);
  }, []);

  return { messages, isStreaming, droppedCount, send, retry, stop, reset };
}
