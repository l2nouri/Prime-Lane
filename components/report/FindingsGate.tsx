"use client";

import { useState } from "react";
import type { ModuleScores } from "@/lib/assessment";

const REVENUE_RANGES = [
  { value: "under-10k", label: "Under €10k/month" },
  { value: "10k-30k", label: "€10k–30k/month" },
  { value: "30k-80k", label: "€30k–80k/month" },
  { value: "80k-200k", label: "€80k–200k/month" },
  { value: "over-200k", label: "Over €200k/month" },
];

export default function FindingsGate({
  scores,
  totalScore,
  onSubmitted,
}: {
  scores: ModuleScores;
  totalScore: number;
  onSubmitted: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [revenue, setRevenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !revenue || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email,
          revenue,
          scores,
          totalScore,
          timestamp: new Date().toISOString(),
          source: "assessment",
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      onSubmitted(email);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-[8px] px-6 py-7"
      style={{ border: "1px solid var(--color-whisper)" }}
    >
      <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-2">
        Get your full report
      </p>
      <h3
        className="font-sans font-medium text-ink mb-1"
        style={{ fontSize: 20, letterSpacing: "-0.01em" }}
      >
        See exactly what we found, what it costs, and the fix
      </h3>
      <p className="text-[14px] text-stone mb-5">
        Enter your email and monthly revenue and we&apos;ll send the full breakdown for both
        areas straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink placeholder:text-stone focus:outline-none focus:border-violet transition-colors duration-150"
        />
        <select
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          required
          className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink focus:outline-none focus:border-violet transition-colors duration-150 bg-canvas"
        >
          <option value="" disabled>Monthly revenue</option>
          {REVENUE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
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
          {loading ? "Sending…" : "Send me my full report →"}
        </button>
      </form>

      <p className="font-mono text-[11px] text-stone mt-3 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
