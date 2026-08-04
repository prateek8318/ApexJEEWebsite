"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userSubjectApi } from "@/lib/api/user/subject";
import ChapterSidebar from "./components/chapter-sidebar";
import ChapterHero from "./components/chapter-hero";
import ChapterContentTabs from "./components/chapter-content-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

const SelfLearningPage = () => {
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  // Fetch all active subjects
  const { 
    data: subjectsData, 
    isLoading: isSubjectsLoading, 
    isError: isSubjectsError 
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => userSubjectApi.getAllSubjects(),
  });

  const subjects = subjectsData?.data || [];

  // Set initial active subject
  useEffect(() => {
    if (subjects.length > 0 && !activeSubjectId) {
      setActiveSubjectId(subjects[0]._id);
    }
  }, [subjects, activeSubjectId]);

  // Fetch chapters for active subject
  const {
    data: chaptersData,
    isLoading: isChaptersLoading,
    isError: isChaptersError
  } = useQuery({
    queryKey: ["chapters", "subject", activeSubjectId],
    queryFn: () => userSubjectApi.getChaptersBySubject(activeSubjectId!),
    enabled: !!activeSubjectId,
  });

  const chapters = chaptersData?.data || [];

  // Set initial active chapter
  useEffect(() => {
    if (chapters.length > 0 && (!activeChapterId || !chapters.find(c => c._id === activeChapterId))) {
      setActiveChapterId(chapters[0]._id);
    }
  }, [chapters, activeChapterId]);

  if (isSubjectsLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f4f6f9] p-8 space-x-4">
        <Skeleton className="h-full w-[300px] rounded-xl" />
        <Skeleton className="h-full flex-1 rounded-xl" />
      </div>
    );
  }

  if (isSubjectsError || (activeSubjectId && isChaptersError)) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f4f6f9] p-8">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-900 bg-red-950/50 text-red-200">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <p className="text-sm opacity-90 mt-1">Failed to load study materials.</p>
        </div>
      </div>
    );
  }

  const activeSubject = subjects.find(s => s._id === activeSubjectId);
  const activeChapter = chapters.find(c => c._id === activeChapterId);

  return (
    <div className="flex min-h-screen min-w-full bg-[#f4f6f9]">
      <ChapterSidebar
        subjects={subjects}
        chapters={chapters}
        activeSubjectId={activeSubjectId}
        onSubjectSelect={setActiveSubjectId}
        activeChapterId={activeChapterId}
        onChapterSelect={setActiveChapterId}
        isLoadingChapters={isChaptersLoading}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-50xl px-6 py-6">
          {activeSubject && activeChapter ? (
            <>
              <ChapterHero
                chapter={activeChapter}
                subjectLabel={activeSubject.name.toUpperCase()}
              />
              <ChapterContentTabs chapter={activeChapter} />
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-slate-500">
                {subjects.length === 0 
                  ? "No subjects available." 
                  : chapters.length === 0 
                    ? "No chapters available for this subject." 
                    : "Select a chapter to view its materials."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfLearningPage;
