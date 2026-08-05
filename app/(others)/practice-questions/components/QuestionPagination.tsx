"use client";

import { cn } from "@lib/utils";

type QuestionStatus = "correct" | "wrong" | "skipped" | "current" | "untouched";

type Props = {
  total: number;
  current: number;
  statusMap: Record<number, QuestionStatus>;
  onChange: (n: number) => void;
};

const btnStyle: Record<QuestionStatus, string> = {
  correct:   "bg-green-500 border-green-500 text-white",
  wrong:     "bg-red-500 border-red-500 text-white",
  skipped:   "bg-orange-400 border-orange-400 text-white",
  current:   "bg-blue-500 border-blue-500 text-white",
  untouched: "bg-white border-slate-200 text-slate-500 hover:border-slate-300",
};

export const QuestionPagination = ({ total, current, statusMap, onChange }: Props) => (
  <div className="flex flex-wrap gap-1.5 border-b border-slate-100 bg-white px-4 py-2.5">
    {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
      const status = statusMap[n] ?? "untouched";
      return (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "flex size-7 items-center justify-center rounded-md border text-[11px] font-bold transition-all",
            n === current && status === "untouched" ? btnStyle["current"] : btnStyle[status],
            n === current && status !== "untouched" && "ring-2 ring-blue-500 ring-offset-2",
          )}
        >
          {n}
        </button>
      );
    })}
  </div>
);
