"use client";

import { ChevronLeft, ChevronRight, Lightbulb, Zap } from "lucide-react";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  onKnowAnswer: () => void;
  onShowSolution: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  hasPrev: boolean;
  hasNext: boolean;
};

export const QuestionActionBar = ({
  onPrev,

  onSkip,
  onKnowAnswer,
  onShowSolution,
  onSubmit,
  canSubmit,
  hasPrev,

}: Props) => (
  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
    {/* Prev */}
    <button
      type="button"
      onClick={onPrev}
      disabled={!hasPrev}
      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <ChevronLeft className="size-3.5" />
      Prev
    </button>

    {/* Next/Skip */}
    <button
      type="button"
      onClick={onSkip}
      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
    >
      Skip
      <ChevronRight className="size-3.5" />
    </button>

    {/* Know answer */}
    <button
      type="button"
      onClick={onKnowAnswer}
      className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
    >
      <Zap className="size-3" />
      Know answer: Skip
    </button>

    {/* Show Solution */}
    <button
      type="button"
      onClick={onShowSolution}
      className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100"
    >
      <Lightbulb className="size-3" />
      ShowSolution
    </button>

    {/* Submit — pushed to the right */}
    <button
      type="button"
      onClick={onSubmit}
      disabled={!canSubmit}
      className="ml-auto rounded-lg bg-slate-800 px-5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Submit Answer
    </button>
  </div>
);
