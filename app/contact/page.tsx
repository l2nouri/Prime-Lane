"use client";

import { useState } from "react";
import { usePlausible } from "next-plausible";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const plausible = usePlausible();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    revenue: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          revenue: form.revenue,
          message: form.message,
          scores: null,
          totalScore: null,
          timestamp: new Date().toISOString(),
          source: "contact",
        }),
      });
      plausible("ContactFormSubmitted");
      setSent(true);
    } catch {
      setSent(true); // still show success to user
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-whisper rounded-[4px] text-[15px] text-ink placeholder:text-stone focus:outline-none focus:border-violet transition-colors duration-150 bg-canvas";

  return (
    <>
      <Nav />
      <main className="px-6" style={{ paddingTop: 96, paddingBottom: 80 }}>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left */}
          <div style={{ maxWidth: 420 }}>
            <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-5">
              Get in touch
            </p>
            <h1
              className="font-sans font-medium text-ink mb-4"
              style={{ fontSize: 32, letterSpacing: "-0.01em" }}
            >
              Let&apos;s talk about your store.
            </h1>
            <p className="text-[16px] text-stone mt-4 leading-[1.75]">
              Tell us about your store — your results, your goals, or a specific service you&apos;re
              curious about. We&apos;ll get back to you directly, no sales pitch.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <a
                href="mailto:hello@lenava.io"
                className="text-[14px] text-violet hover:underline"
              >
                hello@lenava.io
              </a>
              <p className="font-mono text-[11px] text-stone">Milan, Italy</p>
              <p className="font-mono text-[11px] text-stone">EN · IT · ES</p>
            </div>
          </div>

          {/* Right */}
          <div>
            {sent ? (
              <div className="py-10 text-center">
                <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-3">
                  Message sent
                </p>
                <p className="text-[17px] text-ink mb-2">Thank you.</p>
                <p className="text-[15px] text-stone">
                  I&apos;ll reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <select
                  name="revenue"
                  value={form.revenue}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>Monthly revenue range</option>
                  <option value="under-10k">Under €10k/month</option>
                  <option value="10k-30k">€10k–30k/month</option>
                  <option value="30k-80k">€30k–80k/month</option>
                  <option value="80k-200k">€80k–200k/month</option>
                  <option value="over-200k">Over €200k/month</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Tell me about your store and what you're looking to improve..."
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send →"}
                </button>
                <p className="font-mono text-[11px] text-stone">
                  Typically replies within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
