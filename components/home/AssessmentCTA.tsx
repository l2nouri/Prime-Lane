"use client";

import Link from "next/link";
import { useReveal } from "@/lib/useReveal";

const mockModules = [
  { label: "Customer Response", score: 14, max: 25 },
  { label: "Cart Recovery", score: 8, max: 25 },
  { label: "Post-Purchase", score: 12, max: 25 },
  { label: "Acquisition", score: 7, max: 25 },
];

export default function AssessmentCTA() {
  const leftRef = useReveal();
  const rightRef = useReveal(150);

  return (
    <section
      id="assessment-cta"
      className="py-[80px] px-6"
      style={{ backgroundColor: "var(--color-ink)" }}
    >
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left */}
        <div ref={leftRef} className="reveal flex-1" style={{ maxWidth: 560 }}>
          <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-5">
            Revenue Leak Assessment
          </p>
          <h2
            className="font-sans font-medium text-white mb-4"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
            }}
          >
            Find out exactly where your store is losing money.
          </h2>
          <p
            className="mb-8"
            style={{ fontSize: 16, color: "#737373", lineHeight: 1.7 }}
          >
            8 minutes. 12 questions. A personalized score across response, recovery, retention, and
            acquisition.
            <br />
            Free — and more useful than a 1-hour agency call.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
          >
            Take the free assessment →
          </Link>
          <p className="font-mono text-[11px] mt-3" style={{ color: "#555" }}>
            Free · 8 minutes · No credit card
          </p>
        </div>

        {/* Right — score card mockup */}
        <div ref={rightRef} className="reveal flex-shrink-0 w-full md:w-auto" style={{ minWidth: 260 }}>
          <div
            className="rounded-[8px] p-6"
            style={{ border: "1px solid #333", backgroundColor: "#111" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: "#555" }}>
              Revenue Leak Score
            </p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="font-sans font-medium text-white" style={{ fontSize: 52 }}>
                73
              </span>
              <span className="font-sans font-medium" style={{ fontSize: 24, color: "#555" }}>
                /100
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {mockModules.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px]" style={{ color: "#888" }}>
                      {m.label}
                    </span>
                    <span className="font-mono text-[10px] text-violet">
                      {m.score}/{m.max}
                    </span>
                  </div>
                  <div className="h-[3px] rounded-full" style={{ backgroundColor: "#2a2a2a" }}>
                    <div
                      className="h-[3px] rounded-full bg-violet"
                      style={{ width: `${(m.score / m.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
