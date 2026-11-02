"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconButton } from "./IconButton";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Side panel on the inline-end edge. Native modal <dialog>: focus trap, Esc and inert page for free. */
export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click whose target is the <dialog> itself landed on the backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 ms-auto h-dvh max-h-none w-full max-w-sm border-s border-border bg-surface text-fg shadow-2xl transition-[translate] duration-200 ease-out backdrop:bg-black/50 starting:open:-translate-x-full"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="font-bold">
            {title}
          </h2>
          <IconButton label="بستن" onClick={onClose}>
            <X aria-hidden />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">{children}</div>
        {footer && <div className="border-t border-border p-4">{footer}</div>}
      </div>
    </dialog>
  );
}
