"use client";

import { useReveal } from "@/lib/useReveal";
import { useCountUp } from "@/lib/useCountUp";

const problems = [
  {
    num: "01",
    prefix: "",
    target: 70,
    suffix: "%",
    description: "of carts are abandoned — and most stores recover none of them",
    icon: CartIcon,
  },
  {
    num: "02",
    prefix: "",
    target: 3,
    suffix: "+ hours",
    description: "average response time after business hours = lost sale",
    icon: ClockIcon,
  },
  {
    num: "03",
    prefix: "2–",
    target: 3,
    suffix: "×",
    description: "more spent by repeat customers — but most brands go silent after the order",
    icon: TrendIcon,
  },
];

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 3h2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.3h8.4a1.5 1.5 0 0 0 1.5-1.2L20 8H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20" r="1.25" fill="currentColor" />
      <circle cx="17" cy="20" r="1.25" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 16.5 9 11l4 4 7.5-7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.5 7h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProblemCard({
  num,
  prefix,
  target,
  suffix,
  description,
  icon: Icon,
  delay,
  borderRight,
}: {
  num: string;
  prefix: string;
  target: number;
  suffix: string;
  description: string;
  icon: () => JSX.Element;
  delay: number;
  borderRight: boolean;
}) {
  const ref = useReveal(delay);
  const { ref: countRef, value } = useCountUp(target);
  const displayValue = Number.isInteger(target) ? Math.round(value) : value.toFixed(1);

  return (
    <div
      ref={ref}
      className={`reveal p-8 ${borderRight ? "md:border-r border-whisper" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[11px] text-stone uppercase tracking-wider">{num}</p>
        <span className="text-stone/70">
          <Icon />
        </span>
      </div>
      <p
        ref={countRef}
        className="font-mono font-medium text-violet mb-3"
        style={{ fontSize: 32, letterSpacing: "-0.01em" }}
      >
        {prefix}
        {displayValue}
        {suffix}
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
              num={p.num}
              prefix={p.prefix}
              target={p.target}
              suffix={p.suffix}
              description={p.description}
              icon={p.icon}
              delay={i * 100}
              borderRight={i < problems.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
