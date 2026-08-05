"use client";

import { useState } from "react";
import { cn } from "@lib/utils";

type QuestionStatus = "correct" | "wrong" | "skipped" | "current" | "untouched";

type Props = {
  total: number;
  currentQ: number;
  statusMap: Record<number, QuestionStatus>;
  onSelectQ: (n: number) => void;
};

// Simple SVG donut
const DonutChart = ({
  correct,
  wrong,
  skipped,
  total,
}: {
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
}) => {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * r;
  const answered = correct + wrong + skipped;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  const segments = [
    { value: correct, color: "#22c55e" },
    { value: wrong, color: "#ef4444" },
    { value: skipped, color: "#f97316" },
    { value: total - answered, color: "#e2e8f0" },
  ];

  let offset = 0;
  const paths = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dash = pct * circ;
    const el = (
      <circle
        key={seg.color}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={-offset * circ}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    );
    offset += pct;
    return el;
  });

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 100 100" className="size-28">
        {paths}
        <text x="50" y="46" textAnchor="middle" className="text-[13px] font-black fill-slate-800" fontSize="13" fontWeight="800">
          {accuracy}%
        </text>
        <text x="50" y="57" textAnchor="middle" fontSize="7" fontWeight="600" fill="#94a3b8" letterSpacing="0.05em">
          ACCURACY
        </text>
      </svg>
    </div>
  );
};

const statusStyle: Record<QuestionStatus, string> = {
  correct:   "bg-green-500 border-green-500 text-white",
  wrong:     "bg-red-500 border-red-500 text-white",
  skipped:   "bg-orange-400 border-orange-400 text-white",
  current:   "bg-blue-500 border-blue-500 text-white",
  untouched: "bg-white border-slate-200 text-slate-500",
};

const legendItems: { label: string; status: QuestionStatus }[] = [
  { label: "Current",   status: "current" },
  { label: "Correct",   status: "correct" },
  { label: "Wrong",     status: "wrong" },
  { label: "Skipped",   status: "skipped" },
  { label: "Untouched", status: "untouched" },
];

export const SessionOverview = ({ total, currentQ, statusMap, onSelectQ }: Props) => {
  const [tab, setTab] = useState<"palette" | "performance">("palette");

  const correct   = Object.values(statusMap).filter((s) => s === "correct").length;
  const wrong     = Object.values(statusMap).filter((s) => s === "wrong").length;
  const skipped   = Object.values(statusMap).filter((s) => s === "skipped").length;
  const remaining = total - correct - wrong - skipped;

  const stats = [
    { label: "Correct",   value: correct,            color: "bg-green-500" },
    { label: "Wrong",     value: wrong,              color: "bg-red-500" },
    { label: "Skipped",   value: skipped,            color: "bg-orange-400" },
    { label: "Remaining", value: Math.max(remaining, 0), color: "bg-slate-300" },
  ];

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4 border-l border-slate-200 bg-white p-4 overflow-y-auto">
      <h3 className="text-sm font-bold text-slate-800">Session Overview</h3>

      <DonutChart correct={correct} wrong={wrong} skipped={skipped} total={total} />

      <div className="flex flex-col gap-2">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full shrink-0", s.color)} />
            <span className="flex-1 text-[11px] text-slate-500">{s.label}</span>
            <span className="text-[12px] font-bold text-slate-700">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {(["palette", "performance"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 pb-2 text-[11px] font-semibold capitalize transition-colors",
              tab === t
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "palette" && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Question Palette
          </p>

          {/* Grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
              const status = statusMap[n] ?? "untouched";
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onSelectQ(n)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-md border text-[11px] font-bold transition-all",
                    statusStyle[status],
                    n === currentQ && "ring-2 ring-blue-400 ring-offset-1",
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={cn("size-3 rounded-sm border text-[0px]", statusStyle[item.status])} />
                <span className="text-[9px] text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "performance" && (
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Performance analytics will appear after more questions are answered.
        </p>
      )}
    </aside>
  );
};
