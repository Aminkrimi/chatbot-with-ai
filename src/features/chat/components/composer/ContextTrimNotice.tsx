import { Info } from "lucide-react";
import { formatInteger } from "../../format";

export function ContextTrimNotice({ dropped }: { dropped: number }) {
  return (
    <p role="status" className="mx-auto flex w-full max-w-3xl items-center gap-1.5 px-5 pb-1.5 text-[11px] text-muted">
      <Info aria-hidden className="size-3.5 shrink-0" />
      برای جا شدن در حافظهٔ مدل، {formatInteger(dropped)} پیام قدیمی‌تر در این درخواست فرستاده نشد.
    </p>
  );
}
