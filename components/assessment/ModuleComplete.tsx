export default function ModuleComplete({
  moduleName,
  score,
  max,
}: {
  moduleName: string;
  score: number;
  max: number;
}) {
  const pct = (score / max) * 100;

  return (
    <div className="text-center">
      <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-4">
        Module complete
      </p>
      <h2
        className="font-sans font-medium text-ink mb-6"
        style={{ fontSize: 28 }}
      >
        {moduleName}
      </h2>
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="font-mono text-[13px] text-stone">{score}</span>
        <div className="w-32 h-[3px] bg-whisper rounded-full overflow-hidden">
          <div
            className="h-full bg-violet rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-[13px] text-stone">/ {max}</span>
      </div>
    </div>
  );
}
