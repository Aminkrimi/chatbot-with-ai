import { DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from "@/core/chat/limits";
import type { ChatSettings } from "./types";

export const DEFAULT_SETTINGS: ChatSettings = {
  systemPrompt: "",
  temperature: DEFAULT_TEMPERATURE,
  maxTokens: DEFAULT_MAX_TOKENS,
  thinking: true,
};

/** Display only; the server decides which model is called. */
export const MODEL_LABEL = "qwen3.5-35b-a3b";

export const SUGGESTIONS = [
  "تفاوت async/await و Promise در جاوااسکریپت را با مثال توضیح بده.",
  "یک تابع TypeScript بنویس که آرایه را به گروه‌های n‌تایی تقسیم کند.",
  "برای یک ایمیل رسمی درخواست مرخصی، متن کوتاهی بنویس.",
  "سه ایده برای بهبود سرعت یک وب‌سایت Next.js پیشنهاد بده.",
];

/** Headroom for estimation error in `estimateTokens`. */
export const CONTEXT_SAFETY_MARGIN_TOKENS = 1024;
