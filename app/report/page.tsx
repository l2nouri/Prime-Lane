"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScoreDisplay from "@/components/report/ScoreDisplay";
import ModuleBreakdown from "@/components/report/ModuleBreakdown";
import FindingsGate from "@/components/report/FindingsGate";
import BookingCTA from "@/components/shared/BookingCTA";
import { calculateResult, type ModuleScores } from "@/lib/assessment";
import { Suspense } from "react";

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plausible = usePlausible();
  const firedRef = useRef(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

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

        {/* Score display — always visible */}
        <ScoreDisplay result={result} />

        {/* Module breakdown — always visible */}
        <ModuleBreakdown scores={scores} />

        {/* Findings are never shown on-page — email gate leads to a confirmation state */}
        <div className="mt-10">
          {submittedEmail ? (
            <div
              className="rounded-[8px] px-6 py-10 text-center"
              style={{ border: "1px solid var(--color-whisper)" }}
            >
              <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-3">
                Check your inbox
              </p>
              <h2
                className="font-sans font-medium text-ink mb-3"
                style={{ fontSize: "clamp(20px, 3vw, 26px)", letterSpacing: "-0.01em" }}
              >
                We&apos;ve sent your full Revenue Leak Report to {submittedEmail}
              </h2>
              <p className="text-[14px] text-stone mb-8 max-w-[440px] mx-auto">
                It includes what we found, what it&apos;s costing you, and the fix — for both
                areas. Didn&apos;t get it? Check spam, or email us directly.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <BookingCTA
                  variant="inline-button"
                  leadContext={{ email: submittedEmail, scores, totalScore: result.totalScore }}
                />
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-whisper text-ink text-[14px] font-medium rounded-[4px] hover:border-stone transition-colors duration-150"
                >
                  Write to us →
                </Link>
              </div>
            </div>
          ) : (
            <FindingsGate
              scores={scores}
              totalScore={result.totalScore}
              onSubmitted={(email) => {
                plausible("ReportGateSubmitted");
                setSubmittedEmail(email);
              }}
            />
          )}
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
