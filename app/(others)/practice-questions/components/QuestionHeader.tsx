"use client";

import { Flag, Maximize2 } from "lucide-react";
import { cn } from "@lib/utils";

type Props = {
  questionNumber: number;
  subject: string;
  chapter: string;
  topic: string;
  tag: "MCQ" | "MSQ" | "INTEGER" | "SUBJECTIVE";
  exam: string;
  year: string;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
};

export const QuestionHeader = ({
  questionNumber,
  subject,
  chapter,
  topic,
  tag,
  exam,
  year,
  isFlagged = false,
  onToggleFlag,
}: Props) => {
  const tagColors: Record<string, string> = {
    MCQ: "bg-blue-50 text-blue-700",
    MSQ: "bg-purple-50 text-purple-700",
    INTEGER: "bg-green-50 text-green-700",
    SUBJECTIVE: "bg-orange-50 text-orange-700",
  };

  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
      <div className="flex items-center gap-3">
        {/* Q number badge */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
          Q{questionNumber}
        </div>

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-600 uppercase tracking-wide">
            {subject}
          </span>
          <span>/</span>
          <span>{chapter}</span>
          <span>/</span>
          <span className="font-medium text-blue-600">{topic}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", tagColors[tag])}>
          {tag}
        </span>
        <span className="rounded-md bg-yellow-50 px-2 py-0.5 text-[10px] font-bold text-yellow-700 uppercase">
          {exam} {year}
        </span>
        <button
          onClick={onToggleFlag}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors",
            isFlagged
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
          )}
        >
          <Flag className="size-3" />
          {isFlagged ? "Flagged" : "Flag Question"}
        </button>
        <button className="flex size-6 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">
          <Maximize2 className="size-3" />
        </button>
      </div>
    </div>
  );
};
