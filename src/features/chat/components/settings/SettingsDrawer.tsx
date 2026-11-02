import { SquarePen } from "lucide-react";
import { MAX_MAX_TOKENS, MIN_THINKING_MAX_TOKENS } from "@/core/chat/limits";
import { Drawer } from "@/shared/ui/Drawer";
import { SliderField } from "@/shared/ui/SliderField";
import { formatInteger } from "../../format";
import type { ChatSettings } from "../../types";
import { SystemPromptField } from "./SystemPromptField";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onChange: <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => void;
  onNewChat: () => void;
}

const formatTemperature = (value: number) =>
  new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

export function SettingsDrawer({ open, onClose, settings, onChange, onNewChat }: SettingsDrawerProps) {
  const maxTokensHint =
    settings.thinking && settings.maxTokens < MIN_THINKING_MAX_TOKENS
      ? `در حالت تفکر حداقل ${formatInteger(MIN_THINKING_MAX_TOKENS)} توکن استفاده می‌شود، چون توکن‌های تفکر هم جزو خروجی‌اند.`
      : "سقف طول پاسخ، شامل توکن‌های تفکر.";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="تنظیمات"
      footer={
        <button
          type="button"
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          <SquarePen aria-hidden className="size-4" />
          گفتگوی جدید
        </button>
      }
    >
      <div className="flex flex-col gap-7">
        <SystemPromptField value={settings.systemPrompt} onChange={(value) => onChange("systemPrompt", value)} />
        <SliderField
          label="دما (Temperature)"
          value={settings.temperature}
          min={0}
          max={2}
          step={0.1}
          format={formatTemperature}
          onChange={(value) => onChange("temperature", value)}
          hint="مقدار کمتر پاسخ‌های قابل پیش‌بینی‌تر و مقدار بیشتر پاسخ‌های خلاقانه‌تر می‌دهد."
        />
        <SliderField
          label="حداکثر توکن خروجی"
          value={settings.maxTokens}
          min={256}
          max={MAX_MAX_TOKENS}
          step={256}
          format={formatInteger}
          onChange={(value) => onChange("maxTokens", value)}
          hint={maxTokensHint}
        />
      </div>
    </Drawer>
  );
}
