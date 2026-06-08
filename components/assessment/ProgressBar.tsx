export default function ProgressBar({
  current,
  total,
  moduleName,
}: {
  current: number;
  total: number;
  moduleName: string;
}) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="w-full h-[3px] bg-whisper relative">
        <div
          className="absolute left-0 top-0 h-full bg-violet transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-3 px-6">
        <span className="font-mono text-[11px] text-stone">
          Question {current} of {total}
        </span>
        <span className="font-mono text-[12px] text-stone">{moduleName}</span>
      </div>
    </div>
  );
}
