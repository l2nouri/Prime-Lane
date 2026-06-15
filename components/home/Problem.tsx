"use client";

import { useReveal } from "@/lib/useReveal";

const problems = [
  {
    num: "01",
    stat: "70%",
    description: "of carts are abandoned — and most stores recover none of them",
  },
  {
    num: "02",
    stat: "3+ hours",
    description: "average response time after business hours = lost sale",
  },
  {
    num: "03",
    stat: "2–3×",
    description: "more spent by repeat customers — but most brands go silent after the order",
  },
];

function ProblemCard({
  num,
  stat,
  description,
  delay,
  borderRight,
}: {
  num: string;
  stat: string;
  description: string;
  delay: number;
  borderRight: boolean;
}) {
  const ref = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`reveal p-8 ${borderRight ? "md:border-r border-whisper" : ""}`}
    >
      <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-3">{num}</p>
      <p
        className="font-mono font-medium text-violet mb-3"
        style={{ fontSize: 32, letterSpacing: "-0.01em" }}
      >
        {stat}
      </p>
      <p className="text-[14px] text-stone leading-relaxed">{description}</p>
    </div>
  );
}

export default function Problem() {
  const headerRef = useReveal();

  return (
    <section className="py-[120px] bg-canvas px-6">
      <div className="max-w-[800px] mx-auto">
        <div ref={headerRef} className="reveal text-center mb-14">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-5">
            Where revenue leaks
          </p>
          <h2
            className="font-sans font-medium text-ink"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.01em", lineHeight: 1.12 }}
          >
            Three leaks. Most stores fix none of them.
          </h2>
        </div>

        <div className="border border-whisper rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {problems.map((p, i) => (
            <ProblemCard
              key={p.num}
              {...p}
              delay={i * 100}
              borderRight={i < problems.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
