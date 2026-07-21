"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sigma, Zap } from "lucide-react";
import { cn } from "@lib/utils";
import { may2026Calendar } from "@data/timetableSchedule";
import type { CalendarDayEntry } from "@data/timetableSchedule";
import TimetableSection, { timetableStyles } from "./timetable-section";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const LEGEND_ITEMS = [
  { label: "Today", color: "bg-[#1e3a5f]" },
  { label: "Physics", color: "bg-sky-200" },
  { label: "Maths", color: "bg-amber-100" },
  { label: "Off day", color: "bg-rose-100" },
] as const;

const TimetableCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<CalendarDayEntry | null> = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const entry = may2026Calendar.find((item) => item.day === day);
      const dayOfWeek = new Date(year, month, day).getDay();
      const isSunday = dayOfWeek === 0;

      cells.push(
        entry ?? {
          day,
          isOffDay: isSunday,
          tags: isSunday
            ? []
            : [
                { subject: "physics", label: "Study Session" },
                { subject: "maths", label: "Practice" },
              ],
          moreCount: isSunday ? undefined : 2,
        },
      );
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [currentDate]);

  const changeMonth = (direction: -1 | 1) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  return (
    <TimetableSection>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>

        <h2 className={timetableStyles.title}>{monthLabel}</h2>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3.5">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-sm", item.color)} />
            <span className="text-[12px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="border-r border-slate-200 px-1.5 py-2 text-center text-[10px] font-semibold tracking-wider text-slate-400 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarGrid.map((cell, index) => (
            <CalendarCell key={`cell-${index}`} cell={cell} />
          ))}
        </div>
      </div>
    </TimetableSection>
  );
};

type CalendarCellProps = {
  cell: CalendarDayEntry | null;
};

const CalendarCell = ({ cell }: CalendarCellProps) => {
  if (!cell) {
    return (
      <div className="min-h-[96px] border-r border-b border-slate-100 bg-slate-50/60 last:border-r-0" />
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-[96px] border-r border-b border-slate-100 p-1.5 last:border-r-0",
        cell.isOffDay && "bg-rose-50/40",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-slate-700">{cell.day}</span>
        {cell.isToday && (
          <span className="size-2 rounded-full bg-[#1e3a5f]" title="Today" />
        )}
      </div>

      {cell.isOffDay ? (
        <p className="mt-5 text-center text-[11px] font-semibold text-red-500">OFF</p>
      ) : (
        <div className="mt-1 space-y-0.5">
          {cell.tags.map((tag, tagIndex) => (
            <div
              key={`${cell.day}-${tagIndex}`}
              className={cn(
                "flex items-center gap-0.5 truncate rounded px-1 py-0.5 text-[9px] font-medium",
                tag.subject === "physics"
                  ? "bg-sky-100 text-sky-800"
                  : "bg-amber-100 text-amber-800",
              )}
            >
              {tag.subject === "physics" ? (
                <Zap className="size-2 shrink-0 text-amber-500" />
              ) : (
                <Sigma className="size-2 shrink-0 text-orange-600" />
              )}
              <span className="truncate">{tag.label}</span>
            </div>
          ))}
          {cell.moreCount && cell.moreCount > 0 && (
            <p className="text-[9px] text-slate-400">+{cell.moreCount} more</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimetableCalendar;
