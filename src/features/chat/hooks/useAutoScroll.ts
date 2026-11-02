import { useCallback, useEffect, useRef, useState } from "react";

/** Distance from the bottom (px) that still counts as "at the bottom". */
const BOTTOM_THRESHOLD = 4;

/**
 * Keeps a scroll container pinned to the bottom while its content grows.
 * Scrolling up unpins it; scrolling back to the bottom (or `scrollToBottom`) re-pins.
 */
export function useAutoScroll<S extends HTMLElement, C extends HTMLElement>() {
  const scrollRef = useRef<S>(null);
  const contentRef = useRef<C>(null);
  const pinned = useRef(true);
  const [isPinned, setIsPinned] = useState(true);

  useEffect(() => {
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;

    let lastTop = scroller.scrollTop;
    const onScroll = () => {
      const atBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < BOTTOM_THRESHOLD;
      // Only an upward scroll unpins; content shrinking also lowers scrollTop but lands at the bottom.
      if (atBottom) pinned.current = true;
      else if (scroller.scrollTop < lastTop) pinned.current = false;
      lastTop = scroller.scrollTop;
      setIsPinned(pinned.current);
    };

    // Observing size (not message state) also catches code highlighting and panels opening.
    const observer = new ResizeObserver(() => {
      if (pinned.current) scroller.scrollTop = scroller.scrollHeight;
    });

    scroller.addEventListener("scroll", onScroll, { passive: true });
    observer.observe(content);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    pinned.current = true;
    setIsPinned(true);
    scroller.scrollTo({ top: scroller.scrollHeight, behavior });
  }, []);

  return { scrollRef, contentRef, isPinned, scrollToBottom };
}
