import { MODULE_NAMES, MODULE_MAX, getStatusBadge, type ModuleScores } from "@/lib/assessment";

const STATUS_COLORS: Record<string, string> = {
  Critical: "#ef4444",
  "Needs work": "#f59e0b",
  Good: "#22c55e",
  Strong: "var(--color-violet)",
};

export default function ModuleBreakdown({ scores }: { scores: ModuleScores }) {
  return (
    <div className="flex flex-col gap-4 mt-8">
      {(Object.entries(scores) as [keyof ModuleScores, number][]).map(([key, score]) => {
        const pct = (score / MODULE_MAX) * 100;
        const badge = getStatusBadge(score);
        return (
          <div key={key} className="flex items-center gap-4">
            <span className="text-[14px] font-medium text-ink w-44 flex-shrink-0">
              {MODULE_NAMES[key]}
            </span>
            <div className="flex-1 h-[4px] bg-mist rounded-full overflow-hidden">
              <div
                className="h-full bg-violet rounded-full"
                style={{
                  width: `${pct}%`,
                  transition: "width 800ms ease-out",
                }}
              />
            </div>
            <span className="font-mono text-[12px] text-violet w-10 text-right">
              {score}/{MODULE_MAX}
            </span>
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                color: STATUS_COLORS[badge],
                backgroundColor: `${STATUS_COLORS[badge]}18`,
              }}
            >
              {badge}
            </span>
          </div>
        );
      })}
    </div>
  );
}
