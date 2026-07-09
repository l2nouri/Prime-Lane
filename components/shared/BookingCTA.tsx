export default function BookingCTA({ variant = "section" }: { variant?: "section" | "inline" }) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  if (!bookingUrl) return null;

  if (variant === "inline") {
    return (
      <div className="bg-canvas border border-whisper rounded-[8px] p-6">
        <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-2">
          Prefer to talk?
        </p>
        <p className="text-[14px] text-graphite leading-relaxed mb-4">
          Book a free 20-minute Revenue Leak Review — we&apos;ll walk through your report together
          and identify what to fix first.
        </p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
        >
          Book a free 20-minute Revenue Leak Review →
        </a>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-canvas border border-whisper rounded-[8px] p-7 text-center">
      <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-3">
        Next step
      </p>
      <h2
        className="font-sans font-medium text-ink mb-3"
        style={{ fontSize: "clamp(20px, 3vw, 28px)", letterSpacing: "-0.01em" }}
      >
        Book a free 20-minute Revenue Leak Review
      </h2>
      <p className="text-[15px] text-stone mb-6 max-w-[480px] mx-auto">
        We&apos;ll walk through your report together and identify exactly what to fix first.
      </p>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
      >
        Book your free review →
      </a>
    </div>
  );
}
