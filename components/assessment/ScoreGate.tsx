"use client";

import { useState } from "react";

export default function ScoreGate({
  totalScore,
  onUnlock,
}: {
  totalScore: number;
  onUnlock: (name: string, email: string, revenue: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [revenue, setRevenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !revenue) return;
    setLoading(true);
    await onUnlock(name, email, revenue);
    setRevealed(true);
    setLoading(false);
  };

  return (
    <div className="w-full text-center">
      <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-4">
        Your Revenue Leak Score
      </p>

      {/* Blurred score */}
      <div className="relative inline-block mb-2">
        <span
          className="font-sans font-medium text-ink block transition-all duration-500"
          style={{
            fontSize: 80,
            letterSpacing: "-0.02em",
            filter: revealed ? "none" : "blur(10px)",
            userSelect: "none",
          }}
        >
          {totalScore}
        </span>
        <span className="font-mono text-[13px] text-stone">/100</span>
      </div>

      {!revealed && (
        <div className="mt-6">
          <p className="text-[16px] text-stone mb-6">
            Enter your details to unlock your full report.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
            <input
              type="text"
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <select
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              required
              className="w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink focus:outline-none focus:border-violet transition-colors duration-150 bg-canvas"
            >
              <option value="" disabled>Monthly revenue range</option>
              <option value="under-10k">Under €10k/month</option>
              <option value="10k-30k">€10k–30k/month</option>
              <option value="30k-80k">€30k–80k/month</option>
              <option value="80k-200k">€80k–200k/month</option>
              <option value="over-200k">Over €200k/month</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150 disabled:opacity-60"
            >
              {loading ? "Unlocking..." : "Unlock my report →"}
            </button>
          </form>
          <p className="font-mono text-[11px] text-stone mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      )}
    </div>
  );
}
