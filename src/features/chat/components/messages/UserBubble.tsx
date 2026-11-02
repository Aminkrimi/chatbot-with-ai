import { detectDirection } from "@/shared/lib/textDirection";
import { CopyButton } from "@/shared/ui/CopyButton";

/** Sits on the start (right) edge in RTL, with its copy button beside it. */
export function UserBubble({ content }: { content: string }) {
  return (
    <div className="group flex items-start justify-start gap-1">
      <p
        dir={detectDirection(content)}
        className="max-w-[85%] rounded-2xl rounded-ss-sm bg-surface-2 px-4 py-2.5 leading-8 whitespace-pre-wrap wrap-anywhere"
      >
        {content}
      </p>
      <CopyButton
        label="کپی پیام"
        getText={() => content}
        className="mt-1.5 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
      />
    </div>
  );
}
