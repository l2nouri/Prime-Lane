"use client";

import { useReveal } from "@/lib/useReveal";

const problems = [
  {
    num: "01",
    stat: "3+ hours",
    label: "Response gap",
    description:
      "The average independent ecommerce brand takes over 3 hours to reply to a customer message. By then, they've already bought elsewhere.",
  },
  {
    num: "02",
    stat: "70%",
    label: "Cart abandonment",
    description:
      "Seven out of ten carts are abandoned. Most brands send one generic email — or nothing. The revenue is still recoverable.",
  },
  {
    num: "03",
    stat: "0",
    label: "Post-purchase silence",
    description:
      "Most brands go quiet after the order confirmation. No review request. No upsell. No check-in. A one-time buyer stays a one-time buyer.",
  },
  {
    num: "04",
    stat: "Paid ads only",
    label: "Acquisition gap",
    description:
      "When the ad spend stops, the customers stop. Brands without a systematic outreach or referral engine are always one algorithm change away from a slow month.",
  },
];

function ProblemCard({
  num,
  stat,
  label,
  description,
  delay,
  borderRight,
  borderBottom,
}: {
  num: string;
  stat: string;
  label: string;
  description: string;
  delay: number;
  borderRight: boolean;
  borderBottom: boolean;
}) {
  const ref = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`reveal p-8 ${borderRight ? "md:border-r border-whisper" : ""} ${
        borderBottom ? "border-b border-whisper" : ""
      }`}
    >
      <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-3">{num}</p>
      <p
        className="font-mono font-medium text-violet mb-1"
        style={{ fontSize: 32, letterSpacing: "-0.01em" }}
      >
        {stat}
      </p>
      <p className="text-[14px] font-medium text-ink mb-3">{label}</p>
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
            Most ecommerce brands lose 20–35% of potential revenue to four fixable problems.
          </h2>
        </div>

        <div className="border border-whisper rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {problems.map((p, i) => (
            <ProblemCard
              key={p.num}
              {...p}
              delay={i * 100}
              borderRight={i % 2 === 0}
              borderBottom={i < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
