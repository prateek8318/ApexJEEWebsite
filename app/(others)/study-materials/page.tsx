"use client";

import { useMemo, useState } from "react";
import ChapterSidebar from "./components/chapter-sidebar";
import ChapterHero from "./components/chapter-hero";
import ChapterContentTabs from "./components/chapter-content-tabs";
import { defaultChapterId, getChapterById } from "@data/selfLearningData";

const SelfLearningPage = () => {
  const [activeChapterId, setActiveChapterId] = useState(defaultChapterId);

  const chapterData = useMemo(
    () => getChapterById(activeChapterId),
    [activeChapterId],
  );

  if (!chapterData) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f4f6f9] p-8">
        <p className="text-slate-500">Chapter not found.</p>
      </div>
    );
  }

  const { subject, chapter } = chapterData;

  return (
    <div className="flex min-w-full bg-[#f4f6f9]">
      <ChapterSidebar
        activeChapterId={activeChapterId}
        onChapterSelect={setActiveChapterId}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-50xl px-6 py-6">
          <ChapterHero
            chapter={chapter}
            subjectLabel={subject.label.toUpperCase()}
          />
          <ChapterContentTabs chapter={chapter} />
        </div>
      </div>
    </div>
  );
};

export default SelfLearningPage;
