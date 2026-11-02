"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { IconButton } from "./IconButton";

interface CopyButtonProps {
  /** Called on click, so callers can read text lazily (e.g. from the DOM). */
  getText: () => string;
  label?: string;
  className?: string;
}

export function CopyButton({ getText, label = "کپی", className }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <IconButton size="sm" label={copied ? "کپی شد" : label} onClick={() => copy(getText())} className={className}>
      {copied ? <Check className="text-success" aria-hidden /> : <Copy aria-hidden />}
    </IconButton>
  );
}
