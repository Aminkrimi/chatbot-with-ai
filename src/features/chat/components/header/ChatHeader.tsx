import { Settings2, SquarePen } from "lucide-react";
import { IconButton } from "@/shared/ui/IconButton";
import { MODEL_LABEL } from "../../constants";
import { ThemeToggle } from "./ThemeToggle";

interface ChatHeaderProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  canStartNew: boolean;
}

export function ChatHeader({ onNewChat, onOpenSettings, canStartNew }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
        <h1 className="truncate text-sm font-bold sm:text-base">گفتگو با فیوتریکس</h1>
        <span dir="ltr" className="hidden truncate rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted sm:inline">
          {MODEL_LABEL}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <IconButton label="گفتگوی جدید" onClick={onNewChat} disabled={!canStartNew}>
          <SquarePen aria-hidden />
        </IconButton>
        <ThemeToggle />
        <IconButton label="تنظیمات" onClick={onOpenSettings} aria-haspopup="dialog">
          <Settings2 aria-hidden />
        </IconButton>
      </div>
    </header>
  );
}
