"use client";

import { useMemo, useState } from "react";
import { Cog, RotateCcw } from "lucide-react";
import { cn } from "@lib/utils";
import TimetableSection, { timetableStyles } from "./timetable-section";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const MAY_2026_HOLIDAYS = new Set([1]);
const DEFAULT_EXCLUDED_SUNDAYS = new Set([3, 10, 17, 24]);

const LEGEND_ITEMS = [
  { label: "Holiday", color: "bg-rose-200" },
  { label: "Weekend", color: "bg-slate-200" },
  { label: "Excluded", color: "bg-[#111827]" },
] as const;

type DayState = "default" | "holiday" | "weekend" | "excluded";

type Props = {
  onGenerate?: () => void;
};

const ExcludeFromTimetable = ({ onGenerate }: Props) => {
  const [excludedDays, setExcludedDays] = useState<Set<number>>(
    () => new Set(DEFAULT_EXCLUDED_SUNDAYS),
  );

  const calendarDays = useMemo(() => {
    const year = 2026;
    const month = 4;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ day: number; dayOfWeek: number } | null> = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ day, dayOfWeek: new Date(year, month, day).getDay() });
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, []);

  const getDayState = (day: number, dayOfWeek: number): DayState => {
    if (excludedDays.has(day)) return "excluded";
    if (MAY_2026_HOLIDAYS.has(day)) return "holiday";
    if (dayOfWeek === 6) return "weekend";
    return "default";
  };

  const toggleDay = (day: number) => {
    setExcludedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const handleReset = () => {
    setExcludedDays(new Set(DEFAULT_EXCLUDED_SUNDAYS));
  };

  return (
    <TimetableSection>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className={timetableStyles.title}>Exclude from Timetable</h2>
          <p className={timetableStyles.subtitle}>
            Click any date to toggle it as an excluded day. Weekends and holidays are
            marked for convenience.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onGenerate}
            className={timetableStyles.primaryBtn}
          >
            <Cog className="size-4" />
            Generate Timetable
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={timetableStyles.secondaryBtn}
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-serif text-lg font-bold text-slate-900">May 2026</h3>

        <div className="flex flex-wrap items-center gap-4">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={cn("size-3 rounded-full", item.color)} />
              <span className="text-[12px] text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2.5 grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-semibold tracking-wider text-slate-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const state = getDayState(cell.day, cell.dayOfWeek);

            return (
              <button
                key={cell.day}
                type="button"
                onClick={() => toggleDay(cell.day)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-xl border transition-all hover:scale-[1.02]",
                  state === "excluded" &&
                    "border-[#111827] bg-[#111827] text-white shadow-sm",
                  state === "holiday" &&
                    "border-rose-200 bg-rose-50 text-red-500 hover:bg-rose-100/80",
                  state === "weekend" &&
                    "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                  state === "default" &&
                    "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "text-base font-semibold",
                    state === "excluded" && "text-white",
                    state === "holiday" && "text-red-500",
                  )}
                >
                  {cell.day}
                </span>

                {state === "holiday" && (
                  <span className="mt-0.5 text-[9px] font-bold tracking-wide text-red-500">
                    HOLIDAY
                  </span>
                )}
                {state === "weekend" && (
                  <span className="mt-0.5 text-[9px] font-bold tracking-wide text-slate-400">
                    WEEKEND
                  </span>
                )}
                {state === "excluded" && (
                  <span className="mt-0.5 text-[9px] font-bold tracking-wide text-white/80">
                    EXCLUDED
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </TimetableSection>
  );
};

export default ExcludeFromTimetable;
