"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScoreDisplay from "@/components/report/ScoreDisplay";
import ModuleBreakdown from "@/components/report/ModuleBreakdown";
import FindingCard from "@/components/report/FindingCard";
import { calculateResult, MODULE_NAMES, type ModuleScores } from "@/lib/assessment";
import { Suspense } from "react";

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plausible = usePlausible();
  const firedRef = useRef(false);

  const scoresParam = searchParams.get("scores");

  useEffect(() => {
    if (!scoresParam) {
      router.replace("/assessment");
    }
  }, [scoresParam, router]);

  useEffect(() => {
    if (scoresParam && !firedRef.current) {
      firedRef.current = true;
      plausible("ReportViewed");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoresParam]);

  if (!scoresParam) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-mono text-[13px] text-stone mb-4">
            Your session expired — retake the assessment.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
          >
            Start assessment →
          </Link>
        </div>
      </div>
    );
  }

  let scores: ModuleScores;
  try {
    scores = JSON.parse(scoresParam);
  } catch {
    router.replace("/assessment");
    return null;
  }

  const result = calculateResult(scores);
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const sortedModules = (Object.entries(scores) as [keyof ModuleScores, number][]).sort(
    ([, a], [, b]) => a - b
  );

  return (
    <>
      <Nav />
      <main className="px-6 py-16" style={{ paddingTop: 96, maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-sans font-medium text-ink mb-1" style={{ fontSize: 32 }}>
            Your Revenue Leak Report
          </h1>
          <p className="font-mono text-[12px] text-stone">
            Ecommerce audit · {today}
          </p>
        </div>

        {/* Score display */}
        <ScoreDisplay result={result} />

        {/* Module breakdown */}
        <ModuleBreakdown scores={scores} />

        {/* Finding cards */}
        <div className="mt-10 flex flex-col gap-4">
          {sortedModules.map(([key], i) => (
            <FindingCard key={key} moduleKey={key} score={scores[key]} index={i} />
          ))}
        </div>

        {/* Highlight CTA */}
        <div
          className="mt-10 rounded-[8px] p-7 text-center"
          style={{ backgroundColor: "var(--color-glow)" }}
        >
          <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-3">
            Your highest-impact fix
          </p>
          <h2
            className="font-sans font-medium text-ink mb-3"
            style={{ fontSize: "clamp(20px, 3vw, 28px)", letterSpacing: "-0.01em" }}
          >
            {MODULE_NAMES[result.highestLeak]}
          </h2>
          <p className="text-[15px] text-stone mb-6">
            This is your biggest revenue leak. It&apos;s also the fastest to fix.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
          >
            Let&apos;s fix this together →
          </Link>
          <p className="mt-3 text-[13px] text-stone">
            Or email{" "}
            <a href="mailto:hello@primelane.com" className="text-violet hover:underline">
              hello@primelane.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportContent />
    </Suspense>
  );
}
