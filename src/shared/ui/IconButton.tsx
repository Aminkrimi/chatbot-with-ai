import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name; also shown as the native tooltip. */
  label: string;
  size?: "sm" | "md";
}

const SIZES = {
  sm: "size-7 rounded-md [&_svg]:size-3.5",
  md: "size-9 rounded-lg [&_svg]:size-[18px]",
};

export function IconButton({ label, size = "md", className = "", type = "button", children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-40 ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
