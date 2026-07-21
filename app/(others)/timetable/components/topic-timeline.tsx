"use client";

import { BarChart3, Sigma, Zap } from "lucide-react";
import {
  mathsTimelineBars,
  physicsTimelineBars,
  timetableMonths,
  timelineTodayDay,
  timelineTodayMonth,
} from "@data/timetableSchedule";
import type { TimelineBar } from "@data/timetableSchedule";
import TimetableSection, { timetableStyles } from "./timetable-section";

const MONTH_COUNT = timetableMonths.length;
const TODAY_POSITION = timelineTodayMonth + timelineTodayDay / 31;

const TopicTimeline = () => (
  <TimetableSection>
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
        <BarChart3 className="size-[18px]" />
      </div>
      <div>
        <h2 className={timetableStyles.title}>Topic Timeline</h2>
        <p className={timetableStyles.subtitle}>
          Scroll right to see full schedule • Each coloured bar = one topic • Hover for
          details
        </p>
      </div>
    </div>

    <div className="mt-5 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
      <div className="min-w-[880px]">
        <div className="grid grid-cols-[120px_repeat(8,minmax(80px,1fr))]">
          <div className="border-b border-slate-200" />
          {timetableMonths.map((month) => (
            <div
              key={month}
              className="border-b border-r border-slate-100 px-1.5 py-2.5 text-center text-[10px] font-semibold tracking-wider text-slate-400 last:border-r-0"
            >
              {month}
            </div>
          ))}

          <TimelineRow
            subjectLabel="Physics"
            icon={<Zap className="size-3 text-amber-500" />}
            bars={physicsTimelineBars}
          />

          <TimelineRow
            subjectLabel="Mathematics"
            icon={<Sigma className="size-3 text-slate-500" />}
            bars={mathsTimelineBars}
          />
        </div>
      </div>
    </div>

    <div className="mt-5 grid gap-x-3 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-4">
      {[...physicsTimelineBars, ...mathsTimelineBars].map((bar) => (
        <div key={bar.id} className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: bar.color }}
          />
          <span className="truncate text-[11px] text-slate-600">{bar.fullLabel}</span>
        </div>
      ))}
    </div>
  </TimetableSection>
);

type TimelineRowProps = {
  subjectLabel: string;
  icon: React.ReactNode;
  bars: TimelineBar[];
};

const TimelineRow = ({ subjectLabel, icon, bars }: TimelineRowProps) => (
  <>
    <div className="flex items-center gap-2 border-r border-b border-slate-100 px-2.5 py-6">
      {icon}
      <span className="text-[13px] font-medium text-slate-700">{subjectLabel}</span>
    </div>

    <div className="relative col-span-8 border-b border-slate-100 px-1 py-4">
      <div className="absolute inset-0 grid grid-cols-8">
        {timetableMonths.map((month) => (
          <div key={month} className="border-r border-slate-50 last:border-r-0" />
        ))}
      </div>

      <TodayMarker />

      <div className="relative h-10">
        {bars.map((bar) => {
          const left = (bar.startMonth / MONTH_COUNT) * 100;
          const width = ((bar.endMonth - bar.startMonth) / MONTH_COUNT) * 100;

          return (
            <div
              key={bar.id}
              title={bar.fullLabel}
              className="absolute top-1/2 flex h-6 -translate-y-1/2 items-center justify-center rounded-md px-1.5 text-[9px] font-medium text-white shadow-sm transition-transform hover:z-10 hover:scale-[1.03]"
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 7)}%`,
                backgroundColor: bar.color,
              }}
            >
              <span className="truncate">{bar.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

const TodayMarker = () => {
  const leftPercent = (TODAY_POSITION / MONTH_COUNT) * 100;

  return (
    <div
      className="pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-red-500"
      style={{ left: `${leftPercent}%` }}
    >
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap text-white">
        {timelineTodayDay} May
      </span>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap text-white">
        Today
      </span>
    </div>
  );
};

export default TopicTimeline;
