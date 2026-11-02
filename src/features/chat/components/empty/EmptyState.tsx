import { Sparkles } from "lucide-react";
import { SUGGESTIONS } from "../../constants";
import { SuggestionChip } from "./SuggestionChip";

export function EmptyState({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10">
      <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Sparkles aria-hidden className="size-6" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">امروز چطور می‌توانم کمکتان کنم؟</h2>
          <p className="text-sm text-muted">سؤال بپرسید، کد بخواهید یا متنی را برای بازنویسی بفرستید.</p>
        </div>
        <div className="grid w-full gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((text) => (
            <SuggestionChip key={text} text={text} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
