"use client";

import { useEffect, useRef, useState } from "react";

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

export function useCountUp(target: number, duration = 1200) {
  const ref = useRef<HTMLDivElement>(null);
  // Default to the final value so SSR/no-JS output and the pre-animation
  // paint always show the real number, never a 0 placeholder. The count-up
  // below is a progressive-enhancement replay from 0, layered on top.
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let cancelled = false;
    setValue(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();

          const tick = (now: number) => {
            if (cancelled) return;
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setValue(target * easeOutQuad(progress));
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setValue(target);
            }
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [target, duration]);

  return { ref, value };
}
