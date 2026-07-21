"use client";

import { cn } from "@lib/utils";

type Option = {
  key: "A" | "B" | "C" | "D";
  text: string;
};

type Props = {
  body: string;
  options: Option[];
  selected: string | null;
  onSelect: (key: string) => void;
  showAnswer?: boolean;
  correctAnswer?: string;
};

export const QuestionBody = ({
  body,
  options,
  selected,
  onSelect,
  showAnswer = false,
  correctAnswer,
}: Props) => {
  const getOptionStyle = (key: string) => {
    if (showAnswer && correctAnswer) {
      if (key === correctAnswer)
        return "border-green-400 bg-green-50 text-green-800";
      if (key === selected && key !== correctAnswer)
        return "border-red-400 bg-red-50 text-red-800";
    }
    if (selected === key)
      return "border-blue-500 bg-blue-50 text-blue-900 shadow-sm";
    return "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50";
  };

  const getKeyStyle = (key: string) => {
    if (showAnswer && correctAnswer) {
      if (key === correctAnswer) return "bg-green-500 text-white border-green-500";
      if (key === selected && key !== correctAnswer) return "bg-red-500 text-white border-red-500";
    }
    if (selected === key) return "bg-blue-500 text-white border-blue-500";
    return "border-slate-300 text-slate-500";
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Question text */}
      <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-800">
        {body}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => !showAnswer && onSelect(opt.key)}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
              getOptionStyle(opt.key),
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                getKeyStyle(opt.key),
              )}
            >
              {opt.key}
            </span>
            <span className="leading-relaxed">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
