const integer = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });

export const formatInteger = (value: number) => integer.format(value);

/** 1234 → "۱٫۲ ث" */
export const formatSeconds = (ms: number) => `${oneDecimal.format(ms / 1000)} ث`;

/** Whole seconds for prose, never "۰". */
export const formatWholeSeconds = (ms: number) => integer.format(Math.max(1, Math.round(ms / 1000)));
