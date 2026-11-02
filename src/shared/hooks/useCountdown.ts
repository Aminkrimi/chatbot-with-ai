import { useEffect, useState } from "react";

/** Counts down once from `seconds` to 0, one tick per second. */
export function useCountdown(seconds: number): number {
  const [remaining, setRemaining] = useState(Math.max(0, Math.ceil(seconds)));

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return remaining;
}
