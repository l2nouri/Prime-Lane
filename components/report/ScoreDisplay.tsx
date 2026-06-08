"use client";

import { useEffect, useRef, useState } from "react";
import type { AssessmentResult } from "@/lib/assessment";

const LABEL_COLORS: Record<string, string> = {
  "High leak": "#ef4444",
  "Medium leak": "#f59e0b",
  "Low leak": "#22c55e",
  "Minimal leak": "var(--color-violet)",
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScoreDisplay({ result }: { result: AssessmentResult }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const target = result.totalScore;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplayScore(Math.round(eased * target));
      setBarWidth(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [result.totalScore]);

  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className="font-sans font-medium text-ink"
          style={{ fontSize: 72, letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          {displayScore}
        </span>
        <span className="font-mono text-[16px] text-stone">/100</span>
      </div>
      <span
        className="inline-block font-mono text-[12px] font-medium px-3 py-1 rounded-[4px] mb-4"
        style={{
          color: LABEL_COLORS[result.scoreLabel],
          backgroundColor: `${LABEL_COLORS[result.scoreLabel]}18`,
        }}
      >
        {result.scoreLabel}
      </span>
      <div className="w-full h-[6px] bg-mist rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${barWidth}%`,
            backgroundColor: LABEL_COLORS[result.scoreLabel],
            transition: "none",
          }}
        />
      </div>
    </div>
  );
}
