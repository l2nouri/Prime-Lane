"use client";

import { useReveal } from "@/lib/useReveal";

const steps = [
  {
    num: "01",
    title: "Take the Revenue Leak Assessment",
    body: "8 minutes. 8 questions across 2 areas: AI Chatbot readiness and Workflow Automation.",
  },
  {
    num: "02",
    title: "Get your personalized report",
    body: "Instant score across 4 areas. Each module shows what's leaking, what it's costing you, and what to fix first.",
  },
  {
    num: "03",
    title: "We build your highest-impact system",
    body: "Start with one service — the one your report identifies as your biggest revenue leak. Scale from there.",
  },
];

function Step({ num, title, body, delay }: { num: string; title: string; body: string; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="reveal flex flex-col gap-3">
      <p className="font-mono text-[11px] text-violet">{num}</p>
      <h3 className="font-sans font-medium text-ink" style={{ fontSize: 18 }}>
        {title}
      </h3>
      <p className="text-[14px] text-stone leading-relaxed">{body}</p>
    </div>
  );
}

export default function HowItWorks() {
  const headerRef = useReveal();
  const noteRef = useReveal(300);

  return (
    <section id="how-it-works" className="py-[120px] bg-canvas px-6">
      <div className="max-w-[900px] mx-auto">
        <div ref={headerRef} className="reveal mb-12">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-4">
            The process
          </p>
          <h2
            className="font-sans font-medium text-ink"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.01em", lineHeight: 1.15 }}
          >
            Simple. No long contracts. No agency overhead.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <Step key={s.num} {...s} delay={i * 100} />
          ))}
        </div>

        <div ref={noteRef} className="reveal mt-10 pt-10 border-t border-whisper">
          <p className="text-[14px] text-stone text-center">
            No retainer commitment for the first project.
            <br />
            Pay setup fee, see results, then decide on monthly.
          </p>
        </div>
      </div>
    </section>
  );
}
