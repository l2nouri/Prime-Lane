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
                src="/LeilaImage.png"
                alt="Leila Noori, Founder of Lenava"
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
              I&apos;m Leila Noori, founder of Lenava.
            </p>
            <p className="text-[17px] text-graphite mb-8" style={{ lineHeight: 1.7 }}>
              My background spans enterprise integration
              architecture, market intelligence, and business strategy — I&apos;ve spent years building
              systems that connect data across complex operations, and doing the analysis to know what
              that data actually means for growth. I bring that same thinking to ecommerce brands: AI
              systems built with the precision of someone who has spent years making complex business
              systems talk to each other. Not plugins. Not templates. Systems that work the way your
              business actually does. Based in Milan, working across Europe.
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-medium text-ink">Leila Noori</p>
              <p className="font-mono text-[11px] text-stone uppercase tracking-wider">
                Founder, Lenava
              </p>
              <a
                href="mailto:hello@lenava.io"
                className="font-mono text-[12px] text-violet hover:opacity-75 transition-opacity duration-150 mt-2"
              >
                hello@lenava.io
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
