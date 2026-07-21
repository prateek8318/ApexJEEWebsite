"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Play,
  Search,
  Sigma,
  Zap,
} from "lucide-react";
import { cn } from "@lib/utils";
import { selfLearningSubjects } from "@data/selfLearningData";
import type { SelfLearningChapter, SubjectId } from "@/types/SelfLearning";

type Props = {
  activeChapterId: string;
  onChapterSelect: (chapterId: string) => void;
};

const ChapterSidebar = ({ activeChapterId, onChapterSelect }: Props) => {
  const [activeSubject, setActiveSubject] = useState<SubjectId>("physics");
  const [filter, setFilter] = useState("");

  const subject = selfLearningSubjects.find((item) => item.id === activeSubject);

  const filteredUnits = useMemo(() => {
    if (!subject) return [];

    const query = filter.trim().toLowerCase();
    if (!query) return subject.units;

    return subject.units
      .map((unit) => ({
        ...unit,
        chapters: unit.chapters.filter(
          (chapter) =>
            chapter.title.toLowerCase().includes(query) ||
            `ch ${chapter.number}`.includes(query),
        ),
      }))
      .filter((unit) => unit.chapters.length > 0);
  }, [subject, filter]);

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <h2 className="font-serif text-xl font-bold text-slate-900">Chapters</h2>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubject("physics")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              activeSubject === "physics"
                ? "bg-blue-50 text-blue-600"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100",
            )}
          >
            <Zap className="size-3.5" />
            Physics
          </button>
          <button
            type="button"
            onClick={() => setActiveSubject("maths")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              activeSubject === "maths"
                ? "bg-orange-50 text-orange-600"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100",
            )}
          >
            <Sigma className="size-3.5" />
            Maths
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter chapters..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
        {filteredUnits.map((unit) => (
          <div key={unit.id} className="mb-6">
            <p className="mb-2 px-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              {unit.title}
            </p>

            <div className="space-y-1.5">
              {unit.chapters.map((chapter) => (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  isActive={chapter.id === activeChapterId}
                  onSelect={() => onChapterSelect(chapter.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

type ChapterItemProps = {
  chapter: SelfLearningChapter;
  isActive: boolean;
  onSelect: () => void;
};

const ChapterItem = ({ chapter, isActive, onSelect }: ChapterItemProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "group w-full rounded-xl border px-3 py-3 text-left transition-all",
      isActive
        ? "border-amber-300 bg-amber-50/80 shadow-sm"
        : "border-transparent hover:border-slate-200 hover:bg-slate-50",
    )}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          Ch {String(chapter.number).padStart(2, "0")} {chapter.title}
        </p>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${chapter.progress}%` }}
          />
        </div>

        <p className="mt-1.5 text-[11px] text-slate-400">
          {chapter.progress}% • {chapter.videoCount}v • {chapter.questionCount}q •{" "}
          {chapter.pdfCount} PDF
        </p>
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <Play className="size-3" />
        </span>
        <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <FileText className="size-3" />
        </span>
      </div>
    </div>
  </button>
);

export default ChapterSidebar;
