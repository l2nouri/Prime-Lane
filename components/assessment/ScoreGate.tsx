"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ModuleScores } from "@/lib/assessment";
import { getTopInsights, type AnswerRecord } from "@/lib/insights";
import { normalizeUrl } from "@/lib/url";

const INDUSTRIES = [
  "E-commerce",
  "SaaS",
  "Professional Services",
  "Healthcare",
  "Real Estate",
  "Hospitality",
  "Other",
];

export default function ScoreGate({
  totalScore,
  moduleScores,
  answers,
  onCompleted,
}: {
  totalScore: number;
  moduleScores: ModuleScores;
  answers: AnswerRecord[];
  onCompleted: () => void;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const insights = getTopInsights(answers);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !companyName || !websiteUrl || !industry) return;
    setLoading(true);
    setError("");

    const normalizedWebsiteUrl = normalizeUrl(websiteUrl);

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          companyName,
          websiteUrl: normalizedWebsiteUrl,
          industry,
          answers,
          scores: moduleScores,
          totalScore,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      onCompleted();
      router.push(`/report?scores=${encodeURIComponent(JSON.stringify(moduleScores))}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Score — shown openly */}
      <div className="text-center mb-8">
        <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-4">
          Your Revenue Leak Score
        </p>
        <div className="inline-block mb-1">
          <span
            className="font-sans font-medium text-ink block"
            style={{ fontSize: 80, letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {totalScore}
          </span>
        </div>
        <span className="font-mono text-[13px] text-stone">/100</span>
      </div>

      {/* 3 insights from their actual answers */}
      {insights.length > 0 && (
        <div className="mb-8 flex flex-col gap-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex gap-3 items-start px-4 py-3 rounded-[6px]"
              style={{ backgroundColor: "var(--color-glow)" }}
            >
              <span
                className="font-mono text-[11px] font-medium mt-0.5 shrink-0"
                style={{ color: "var(--color-violet)" }}
              >
                0{i + 1}
              </span>
              <p className="text-[14px] text-ink leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      )}

      {/* Gate section */}
      <div
        className="rounded-[8px] px-6 py-6"
        style={{ border: "1px solid var(--color-whisper)" }}
      >
        <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-2">
          Your full report
        </p>
        <h3
          className="font-sans font-medium text-ink mb-1"
          style={{ fontSize: 18, letterSpacing: "-0.01em" }}
        >
          Get your full report, tailored to your business
        </h3>
        <p className="text-[14px] text-stone mb-5">
          Claude will analyse your specific answers and generate a personalised revenue leak report — sent directly to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink placeholder:text-stone focus:outline-none focus:border-violet transition-colors duration-150"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink placeholder:text-stone focus:outline-none focus:border-violet transition-colors duration-150"
          />
          <input
            type="text"
            placeholder="Company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink placeholder:text-stone focus:outline-none focus:border-violet transition-colors duration-150"
          />
          <input
            type="text"
            inputMode="url"
            placeholder="Website URL"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            onBlur={(e) => setWebsiteUrl(normalizeUrl(e.target.value))}
            required
            className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink placeholder:text-stone focus:outline-none focus:border-violet transition-colors duration-150"
          />
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
            className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink focus:outline-none focus:border-violet transition-colors duration-150 bg-canvas"
          >
            <option value="" disabled>Industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {error && (
            <p className="text-[13px]" style={{ color: "#c0392b" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150 disabled:opacity-60"
          >
            {loading ? "Generating your report…" : "Get my report →"}
          </button>
        </form>

        <p className="font-mono text-[11px] text-stone mt-3 text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
