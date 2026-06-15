import Link from "next/link";
import {
  MODULE_NAMES,
  FINDING_COPY,
  COST_COPY,
  SERVICE_FOR_MODULE,
  type ModuleScores,
} from "@/lib/assessment";

function getRange(score: number): "high" | "medium" | "low" {
  if (score <= 20) return "high";
  if (score <= 34) return "medium";
  return "low";
}

export default function FindingCard({
  moduleKey,
  score,
  index,
}: {
  moduleKey: keyof ModuleScores;
  score: number;
  index: number;
}) {
  const range = getRange(score);
  const finding = FINDING_COPY[moduleKey][range];
  const cost = COST_COPY[moduleKey][range];
  const service = SERVICE_FOR_MODULE[moduleKey];

  return (
    <div className="bg-canvas border border-whisper rounded-[8px] p-6 md:p-7">
      <p className="font-mono text-[10px] text-violet uppercase tracking-wider mb-4">
        0{index + 1} — {MODULE_NAMES[moduleKey]}
      </p>

      <div className="space-y-4">
        <div>
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-1.5">
            What we found
          </p>
          <p className="text-[14px] text-graphite leading-relaxed">{finding}</p>
        </div>

        <div className="border-t border-whisper pt-4">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-1.5">
            What this costs
          </p>
          <p className="text-[14px] text-graphite leading-relaxed">{cost}</p>
        </div>

        <div className="border-t border-whisper pt-4">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-1.5">
            The fix
          </p>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] text-graphite">{service.name}</p>
            <Link
              href="/contact"
              className="flex-shrink-0 font-mono text-[11px] text-violet hover:underline"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
