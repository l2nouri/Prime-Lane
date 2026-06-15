"use client";

import Image from "next/image";
import { useReveal } from "@/lib/useReveal";

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" className="py-[120px] px-6" style={{ backgroundColor: "var(--color-mist)" }}>
      <div className="max-w-[900px] mx-auto">
        <div ref={ref} className="reveal flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          {/* Photo */}
          <div className="flex-shrink-0 w-full md:w-[260px]">
            <div
              className="overflow-hidden rounded-[8px]"
              style={{ aspectRatio: "4/5", position: "relative" }}
            >
              <Image
                src="/leila.jpg"
                alt="Leila Noori, Founder of Prime Lane"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-6">
              Who you&apos;re actually working with
            </p>
            <p
              className="font-sans font-medium text-ink mb-6"
              style={{ fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-0.01em", lineHeight: 1.2 }}
            >
              I&apos;m Leila Noori, founder of Prime Lane.
            </p>
            <p className="text-[17px] text-graphite mb-8" style={{ lineHeight: 1.7 }}>
              I come from a background in business and operations, which means I don&apos;t just build
              AI systems — I build them with a real understanding of how businesses actually work.
              Based in Milan, working with e-commerce brands across Europe.
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-medium text-ink">Leila Noori</p>
              <p className="font-mono text-[11px] text-stone uppercase tracking-wider">
                Founder, Prime Lane
              </p>
              <a
                href="mailto:leila@primelane.com"
                className="font-mono text-[12px] text-violet hover:opacity-75 transition-opacity duration-150 mt-2"
              >
                leila@primelane.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
