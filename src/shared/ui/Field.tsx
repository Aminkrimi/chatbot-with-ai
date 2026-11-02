import type { ReactNode } from "react";

interface FieldProps {
  htmlFor: string;
  label: string;
  /** Right-aligned extra, e.g. the current value. */
  aside?: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}

export function Field({ htmlFor, label, aside, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {aside && <span className="text-xs text-muted tabular-nums">{aside}</span>}
      </div>
      {children}
      {hint && <p className="text-xs leading-6 text-muted">{hint}</p>}
    </div>
  );
}
