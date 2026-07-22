"use client";

export default function Error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6 text-center">
      <h1
        className="font-sans font-medium text-ink mb-4"
        style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em", lineHeight: 1.12 }}
      >
        Something went wrong
      </h1>
      <p className="text-stone mb-8" style={{ fontSize: 16, lineHeight: 1.7 }}>
        An unexpected error occurred. Please try again.
      </p>
      <a
        href="/"
        className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
      >
        ← Back to home
      </a>
    </div>
  );
}
