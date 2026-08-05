"use client";

import { cn } from "@lib/utils";

type Option = {
  index: number;
  label: string; // "A", "B", etc.
  text: string;
};

type Props = {
  body: string;
  options: Option[];
  selectedOptions?: number[]; // indices
  integerAnswer?: string;
  onSelectOption: (index: number) => void;
  onSelectInteger: (value: string) => void;
  showAnswer?: boolean;
  correctOptions?: number[]; // indices
  correctInteger?: string;
  type?: "single" | "multiple" | "integer";
};

export const QuestionBody = ({
  body,
  options,
  selectedOptions = [],
  integerAnswer = "",
  onSelectOption,
  onSelectInteger,
  showAnswer = false,
  correctOptions = [],
  correctInteger,
  type = "single",
}: Props) => {
  const getOptionStyle = (index: number) => {
    const isSelected = selectedOptions.includes(index);
    const isCorrect = correctOptions.includes(index);

    if (showAnswer) {
      if (isCorrect)
        return "border-green-400 bg-green-50 text-green-800";
      if (isSelected && !isCorrect)
        return "border-red-400 bg-red-50 text-red-800";
    }
    if (isSelected)
      return "border-blue-500 bg-blue-50 text-blue-900 shadow-sm";
    return "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50";
  };

  const getKeyStyle = (index: number) => {
    const isSelected = selectedOptions.includes(index);
    const isCorrect = correctOptions.includes(index);

    if (showAnswer) {
      if (isCorrect) return "bg-green-500 text-white border-green-500";
      if (isSelected && !isCorrect) return "bg-red-500 text-white border-red-500";
    }
    if (isSelected) return "bg-blue-500 text-white border-blue-500";
    return "border-slate-300 text-slate-500";
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Question text */}
      <div 
        className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-800"
        dangerouslySetInnerHTML={{ __html: body }}
      />

      {/* Options or Input */}
      <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
        {type === "multiple" && "Select one or more correct options:"}
        {type === "single" && "Select a single correct option:"}
        {type === "integer" && "Enter a numerical value:"}
      </div>

      {type === "integer" ? (
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-semibold text-slate-700 mb-1">Your Answer:</label>
          <input
            type="number"
            value={integerAnswer}
            onChange={(e) => !showAnswer && onSelectInteger(e.target.value)}
            disabled={showAnswer}
            className={cn(
              "max-w-[200px] rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              showAnswer && Number(correctInteger) === Number(integerAnswer) && "border-green-500 bg-green-50",
              showAnswer && Number(correctInteger) !== Number(integerAnswer) && "border-red-500 bg-red-50"
            )}
            placeholder="Enter integer..."
          />
          {showAnswer && (
            <p className="text-sm mt-1">
              <span className="font-semibold text-slate-600">Correct Answer: </span>
              <span className="text-green-600 font-bold">{correctInteger}</span>
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => (
            <button
              key={opt.index}
              type="button"
              onClick={() => !showAnswer && onSelectOption(opt.index)}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                getOptionStyle(opt.index),
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border text-[11px] font-bold",
                  type === "single" ? "rounded-full" : "rounded-sm",
                  getKeyStyle(opt.index),
                )}
              >
                {opt.label}
              </div>
              <span className="leading-relaxed">{opt.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
