export default function Footer() {
  return (
    <footer className="border-t border-whisper py-10">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] text-stone uppercase tracking-[0.16em]">
          Built to be found.
        </span>
        <span className="font-mono text-[11px] text-stone">
          © {new Date().getFullYear()} Prime Lane ·{" "}
          <a href="mailto:hello@primelane.com" className="hover:text-ink transition-colors duration-150">
            hello@primelane.com
          </a>
        </span>
      </div>
    </footer>
  );
}
