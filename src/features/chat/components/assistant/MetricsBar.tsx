import { formatInteger, formatSeconds } from "../../format";
import type { MessageMetrics } from "../../types";
import { tokensPerSecond } from "../../utils";
import { MetricItem } from "./MetricItem";

export function MetricsBar({ metrics }: { metrics: MessageMetrics }) {
  const { ttftMs, totalMs, promptTokens, completionTokens } = metrics;
  const speed = tokensPerSecond(metrics);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
      {ttftMs !== undefined && (
        <MetricItem label="اولین توکن" value={formatSeconds(ttftMs)} description="زمان تا دریافت اولین توکن" />
      )}
      {totalMs !== undefined && <MetricItem label="کل" value={formatSeconds(totalMs)} description="زمان کل پاسخ" />}
      {speed !== undefined && (
        <MetricItem label="سرعت" value={`${formatInteger(speed)} توکن/ث`} description="توکن تولیدشده در هر ثانیه" />
      )}
      {promptTokens !== undefined && (
        <MetricItem label="ورودی" value={formatInteger(promptTokens)} description="توکن‌های ورودی" />
      )}
      {completionTokens !== undefined && (
        <MetricItem label="خروجی" value={formatInteger(completionTokens)} description="توکن‌های خروجی (همراه تفکر)" />
      )}
    </div>
  );
}
