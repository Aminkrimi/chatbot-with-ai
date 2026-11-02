import type { ErrorCode } from "@/core/chat/errorCodes";

export type ErrorAction = "retry" | "new_chat";

export interface ErrorCopy {
  title: string;
  hint?: string;
  /** Primary action first. Empty when nothing the user can do in the app will help. */
  actions: ErrorAction[];
}

const ADMIN_HINT = "این مورد باید از سمت مدیر سرویس بررسی شود.";

export const ERROR_COPY: Record<ErrorCode, ErrorCopy> = {
  invalid_api_key: { title: "کلید دسترسی سرور نامعتبر است.", hint: ADMIN_HINT, actions: [] },
  model_not_allowed: { title: "این کلید اجازهٔ استفاده از این مدل را ندارد.", hint: ADMIN_HINT, actions: [] },
  ip_not_allowed: { title: "دسترسی از این آدرس IP مجاز نیست.", hint: ADMIN_HINT, actions: [] },
  model_not_found: { title: "مدل درخواستی پیدا نشد.", hint: ADMIN_HINT, actions: [] },
  context_length_exceeded: {
    title: "گفتگو از ظرفیت حافظهٔ مدل بیشتر شده است.",
    hint: "یک گفتگوی جدید شروع کنید، یا پیام کوتاه‌تری بفرستید.",
    actions: ["new_chat"],
  },
  invalid_request: {
    title: "درخواست نامعتبر بود.",
    hint: "تنظیمات را بررسی کنید و دوباره تلاش کنید.",
    actions: ["retry"],
  },
  rate_limited: { title: "تعداد درخواست‌ها زیاد است.", hint: "چند ثانیه دیگر دوباره تلاش کنید.", actions: ["retry"] },
  quota_exceeded: {
    title: "سهمیهٔ ماهانه تمام شده است.",
    hint: "تا شروع دورهٔ بعد یا افزایش سهمیه، امکان ارسال پیام نیست.",
    actions: [],
  },
  upstream_error: { title: "سرویس مدل با خطا روبه‌رو شد.", hint: "معمولاً موقتی است.", actions: ["retry"] },
  model_maintenance: { title: "مدل در حال نگهداری و به‌روزرسانی است.", hint: "کمی بعد دوباره تلاش کنید.", actions: ["retry"] },
  model_unavailable: { title: "مدل موقتاً در دسترس نیست.", hint: "کمی بعد دوباره تلاش کنید.", actions: ["retry"] },
  upstream_timeout: { title: "پاسخ مدل بیش از حد طول کشید.", hint: "دوباره تلاش کنید.", actions: ["retry"] },
  network_error: { title: "ارتباط با سرور قطع شد.", hint: "اتصال اینترنت را بررسی کنید.", actions: ["retry"] },
  unknown_error: { title: "خطای غیرمنتظره‌ای رخ داد.", actions: ["retry"] },
};
