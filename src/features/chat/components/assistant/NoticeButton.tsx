import type { ButtonHTMLAttributes } from "react";

interface NoticeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
}

export function NoticeButton({ primary, className = "", ...rest }: NoticeButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-3.5 ${
        primary ? "bg-fg text-bg hover:opacity-85" : "border border-border hover:bg-surface-2"
      } ${className}`}
      {...rest}
    />
  );
}
