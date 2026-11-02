import type { ReactNode } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, icon, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        checked ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-fg"
      }`}
    >
      {icon}
      <span>{label}</span>
      <span
        aria-hidden
        className={`relative h-4 w-7 rounded-full transition-colors ${checked ? "bg-accent" : "bg-border-strong"}`}
      >
        <span
          className={`absolute top-0.5 size-3 rounded-full bg-white shadow-sm transition-[inset-inline-start] ${
            checked ? "inset-s-3.5" : "inset-s-0.5"
          }`}
        />
      </span>
    </button>
  );
}
