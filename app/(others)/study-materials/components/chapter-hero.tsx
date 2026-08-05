import { Zap } from "lucide-react";
import { cn } from "@lib/utils";
import type { Chapter } from "@/types/user-api";

type Props = {
  chapter: Chapter;
  subjectLabel: string;
};

const ChapterHero = ({ chapter, subjectLabel }: Props) => {
  const statusLabel = "In Progress";
  const statusColor = "bg-[#f59e0b]";

  // Mocking the subtitle tags since it's not directly in chapter model
  const subtitle = chapter.description || "Biot-Savart • Ampere's Law • Cyclotron • Galvanometer";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1c2438] px-8 py-8 shadow-md">
      <div className="relative flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#273351] px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-[#3b82f6]">
          <Zap className="size-3 fill-[#3b82f6]" />
          {subjectLabel}
        </span>

        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-[#1e293b]/50 px-3 py-1 text-[11px] font-bold text-[#f59e0b]">
          <span className={cn("size-2 rounded-full", statusColor)} />
          {statusLabel}
        </span>
      </div>

      <p className="relative mt-6 text-xs text-slate-400">
        Chapter {String(chapter.chapterNumber).padStart(2, "0")}
      </p>
      <h1 className="relative mt-1 font-serif text-3xl font-bold tracking-wide text-white md:text-4xl">
        {chapter.title}
      </h1>
      <p className="relative mt-2 text-[13px] font-medium text-slate-400">
        {subtitle}
      </p>

      <div className="relative mt-8 flex flex-wrap gap-12">
        <StatBlock value={chapter.videosCount || 0} label="Videos" />
        <StatBlock value={chapter.questionsCount || 0} label="Questions" />
        <StatBlock value={chapter.notesCount || 0} label="PDF Notes" />
      </div>
    </div>
  );
};

type StatBlockProps = {
  value: number;
  label: string;
};

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div>
    <p className="text-xl font-bold text-white mb-1">{value}</p>
    <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
      {label}
    </p>
  </div>
);

export default ChapterHero;
