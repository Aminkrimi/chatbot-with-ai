import type { ComponentPropsWithoutRef } from "react";
import { useRef } from "react";
import type { ExtraProps } from "react-markdown";
import { CopyButton } from "@/shared/ui/CopyButton";
import { codeLanguage } from "../../utils";

type CodeBlockProps = ComponentPropsWithoutRef<"pre"> & ExtraProps;

/** Replaces markdown's <pre>. Code is always LTR, even inside the RTL page. */
export function CodeBlock({ node, children, ...rest }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const language = codeLanguage(node);

  return (
    <div dir="ltr" className="overflow-hidden rounded-xl border border-border bg-code-bg">
      <div className="flex items-center justify-between border-b border-border px-3 py-1">
        <span className="font-mono text-xs text-muted">{language ?? "code"}</span>
        <CopyButton label="کپی کد" getText={() => preRef.current?.textContent ?? ""} />
      </div>
      <pre ref={preRef} {...rest} className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        {children}
      </pre>
    </div>
  );
}
