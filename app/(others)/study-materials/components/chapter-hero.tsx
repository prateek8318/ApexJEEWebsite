import { Zap } from "lucide-react";
import { cn } from "@lib/utils";
import type { Chapter } from "@/types/user-api";

type Props = {
  chapter: Chapter;
  subjectLabel: string;
};

const ChapterHero = ({ chapter, subjectLabel }: Props) => {
  const statusLabel = "Not Started";
  const statusColor = "bg-slate-400";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#0a1628] px-8 py-7 text-white shadow-lg">
      <div className="absolute top-0 right-0 size-64 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/80 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
          <Zap className="size-3" />
          {subjectLabel}
        </span>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          <span className={cn("size-2 rounded-full", statusColor)} />
          {statusLabel}
        </span>
      </div>

      <p className="relative mt-5 text-sm text-slate-400">
        Chapter {String(chapter.chapterNumber).padStart(2, "0")}
      </p>
      <h1 className="relative mt-1 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
        {chapter.title}
      </h1>
      <p className="relative mt-3 text-sm text-slate-400">
        {chapter.description || "Learn the concepts of this chapter."}
      </p>

      <div className="relative mt-8 flex flex-wrap gap-10">
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
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-[11px] font-medium tracking-widest text-slate-400 uppercase">
      {label}
    </p>
  </div>
);

export default ChapterHero;
