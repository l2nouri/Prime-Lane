import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6 text-center">
      <h1
        className="font-sans font-medium text-ink mb-4"
        style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em", lineHeight: 1.12 }}
      >
        Page not found
      </h1>
      <p className="text-stone mb-8" style={{ fontSize: 16, lineHeight: 1.7 }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
      >
        ← Back to home
      </Link>
    </div>
  );
}
