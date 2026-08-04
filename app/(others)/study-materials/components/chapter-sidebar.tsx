"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Play,
  Search,
  Book,
} from "lucide-react";
import { cn } from "@lib/utils";
import type { Subject, Chapter } from "@/types/user-api";

type Props = {
  subjects: Subject[];
  chapters: Chapter[];
  activeSubjectId: string | null;
  onSubjectSelect: (subjectId: string) => void;
  activeChapterId: string | null;
  onChapterSelect: (chapterId: string) => void;
  isLoadingChapters?: boolean;
};

const ChapterSidebar = ({ 
  subjects = [], 
  chapters = [], 
  activeSubjectId, 
  onSubjectSelect, 
  activeChapterId, 
  onChapterSelect,
  isLoadingChapters 
}: Props) => {
  const [filter, setFilter] = useState("");

  const filteredUnits = useMemo(() => {
    if (!chapters || !chapters.length) return [];

    const query = filter.trim().toLowerCase();
    
    // Group chapters by unitName dynamically
    const unitMap = new Map<string, Chapter[]>();
    chapters.forEach(chapter => {
      const unitName = chapter.unitName || "Other";
      if (!unitMap.has(unitName)) {
        unitMap.set(unitName, []);
      }
      unitMap.get(unitName)!.push(chapter);
    });

    const units = Array.from(unitMap.entries()).map(([title, unitChapters]) => ({
      title,
      chapters: unitChapters.sort((a, b) => a.unitOrder - b.unitOrder || a.chapterNumber - b.chapterNumber)
    }));

    if (!query) return units;

    return units
      .map((unit) => ({
        ...unit,
        chapters: unit.chapters.filter(
          (chapter) =>
            chapter.title.toLowerCase().includes(query) ||
            `ch ${chapter.chapterNumber}`.includes(query),
        ),
      }))
      .filter((unit) => unit.chapters.length > 0);
  }, [chapters, filter]);

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <h2 className="font-serif text-xl font-bold text-slate-900">Chapters</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {subjects.map(subject => (
            <button
              key={subject._id}
              type="button"
              onClick={() => onSubjectSelect(subject._id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors min-w-[40%]",
                activeSubjectId === subject._id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100",
              )}
            >
              <Book className="size-3.5" />
              {subject.name}
            </button>
          ))}
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
        {isLoadingChapters ? (
          <div className="flex flex-col gap-4 px-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : filteredUnits.length > 0 ? (
          filteredUnits.map((unit) => (
            <div key={unit.title} className="mb-6">
              <p className="mb-2 px-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                {unit.title}
              </p>

              <div className="space-y-1.5">
                {unit.chapters.map((chapter) => (
                  <ChapterItem
                    key={chapter._id}
                    chapter={chapter}
                    isActive={chapter._id === activeChapterId}
                    onSelect={() => onChapterSelect(chapter._id)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-slate-500 mt-4">No chapters found.</p>
        )}
      </div>
    </aside>
  );
};

type ChapterItemProps = {
  chapter: Chapter;
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
          Ch {String(chapter.chapterNumber).padStart(2, "0")} {chapter.title}
        </p>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: '0%' }}
          />
        </div>

        <p className="mt-1.5 text-[11px] text-slate-400">
          0% • {chapter.videosCount || 0}v • {chapter.questionsCount || 0}q •{" "}
          {chapter.notesCount || 0} PDF
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
