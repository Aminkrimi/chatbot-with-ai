import "server-only";
import type {
  ChatCompletionChunk,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";
import type { ChatEvent } from "@/core/chat/events";
import { DEFAULT_MAX_TOKENS, effectiveMaxTokens } from "@/core/chat/limits";
import type { ChatRequest } from "@/core/chat/schema";
import { CHAT_MODEL, getLLMClient } from "./client";

/** Non-OpenAI body field the server's chat template reads. */
interface ThinkingParams {
  chat_template_kwargs: { enable_thinking: boolean };
}

/**
 * With thinking on, the server streams the chain of thought in `delta.reasoning`,
 * a field the OpenAI types don't declare. This is the only cast in the app.
 */
type ReasoningDelta = ChatCompletionChunk.Choice.Delta & { reasoning?: string | null };

/**
 * Opens the upstream stream. Throws before any event is produced if the request
 * is rejected (so the route can answer with a real HTTP status); errors after
 * that surface from the returned generator.
 */
export async function openChatStream(
  request: ChatRequest,
  signal: AbortSignal,
): Promise<AsyncGenerator<ChatEvent>> {
  const systemPrompt = request.systemPrompt?.trim();
  const messages: ChatCompletionMessageParam[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...request.messages]
    : request.messages;

  const params: ChatCompletionCreateParamsStreaming & ThinkingParams = {
    model: CHAT_MODEL,
    messages,
    stream: true,
    stream_options: { include_usage: true },
    max_tokens: effectiveMaxTokens(request.maxTokens ?? DEFAULT_MAX_TOKENS, request.thinking),
    temperature: request.temperature,
    chat_template_kwargs: { enable_thinking: request.thinking },
  };

  const stream = await getLLMClient().chat.completions.create(params, { signal });
  return toChatEvents(stream);
}

async function* toChatEvents(chunks: AsyncIterable<ChatCompletionChunk>): AsyncGenerator<ChatEvent> {
  let contentStarted = false;

  for await (const chunk of chunks) {
    const delta = chunk.choices[0]?.delta as ReasoningDelta | undefined;

    if (delta?.reasoning) yield { type: "reasoning", text: delta.reasoning };

    if (delta?.content) {
      // After thinking, the answer often opens with a blank line.
      const text = contentStarted ? delta.content : delta.content.trimStart();
      if (text) {
        contentStarted = true;
        yield { type: "content", text };
      }
    }

    if (chunk.usage) {
      const { prompt_tokens, completion_tokens, total_tokens } = chunk.usage;
      yield { type: "usage", prompt_tokens, completion_tokens, total_tokens };
    }
  }
}
