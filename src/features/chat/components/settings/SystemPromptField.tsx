import { useId } from "react";
import { detectDirection } from "@/shared/lib/textDirection";
import { MAX_SYSTEM_PROMPT_CHARS } from "@/core/chat/limits";
import { Field } from "@/shared/ui/Field";
import { formatInteger } from "../../format";

interface SystemPromptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SystemPromptField({ value, onChange }: SystemPromptFieldProps) {
  const id = useId();

  return (
    <Field
      htmlFor={id}
      label="پیام سیستم"
      aside={`${formatInteger(value.length)} / ${formatInteger(MAX_SYSTEM_PROMPT_CHARS)}`}
      hint="در ابتدای هر درخواست، پیش از تاریخچهٔ گفتگو، برای مدل فرستاده می‌شود."
    >
      <textarea
        id={id}
        dir={detectDirection(value)}
        rows={6}
        value={value}
        maxLength={MAX_SYSTEM_PROMPT_CHARS}
        onChange={(e) => onChange(e.target.value)}
        placeholder="مثلاً: تو یک دستیار برنامه‌نویسی هستی و پاسخ‌ها را کوتاه و دقیق می‌دهی."
        className="w-full resize-y rounded-xl border border-border bg-bg px-3 py-2.5 text-sm leading-7 placeholder:text-muted focus-visible:border-accent focus-visible:outline-none"
      />
    </Field>
  );
}
