"use client";

import { useQuery } from "@tanstack/react-query";
import { userChapterApi } from "@/lib/api/user/chapter";
import { userTopicApi } from "@/lib/api/user/topic";
import TopicAccordion from "./components/topic-accordion";
import { BookOpen, Search, AlertCircle, ArrowLeft, Hash } from "lucide-react";
import { useState, use } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Subject } from "@/types/user-api";

export default function ChapterTopicsPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = use(params);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: chapterData, isLoading: isChapterLoading } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => userChapterApi.getChapterById(chapterId),
  });

  const { data: topicsData, isLoading: isTopicsLoading, isError, error } = useQuery({
    queryKey: ["topics", chapterId, searchTerm],
    queryFn: () => userTopicApi.getTopicsByChapter(chapterId, searchTerm),
  });

  const chapter = chapterData?.data;
  const topics = topicsData?.data || [];
  
  const isLoading = isChapterLoading || isTopicsLoading;
  
  // Safe extraction of subject details if populated
  const subjectId = chapter?.subject ? (typeof chapter.subject === 'string' ? chapter.subject : (chapter.subject as Subject)._id) : null;
  const subjectName = chapter?.subject && typeof chapter.subject !== 'string' ? (chapter.subject as Subject).name : "Subject";
  const colorTheme = chapter?.subject && typeof chapter.subject !== 'string' ? (chapter.subject as Subject).colorTheme : "#3b82f6";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        {subjectId ? (
          <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-900 -ml-3">
            <Link href={`/subjects/${subjectId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to {subjectName}
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-900 -ml-3">
            <Link href="/subjects">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Subjects
            </Link>
          </Button>
        )}
      </div>

      {isChapterLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 bg-slate-200" />
          <Skeleton className="h-4 w-96 bg-slate-200" />
        </div>
      ) : chapter ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1 text-sm font-medium text-slate-500">
            <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs text-slate-600 border border-slate-200">
              Unit {chapter.unitOrder} • {chapter.unitName}
            </span>
            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs border border-blue-100">
              Chapter {chapter.chapterNumber.toString().padStart(2, '0')}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div 
              className="p-2 rounded-lg bg-slate-100 flex items-center justify-center"
              style={{ color: colorTheme || "#3b82f6" }}
            >
              <BookOpen className="h-6 w-6" />
            </div>
            {chapter.title}
          </h1>
          
          {chapter.subtitle && (
            <p className="text-slate-500 text-lg">
              {chapter.subtitle}
            </p>
          )}
          
          {chapter.description && (
            <p className="text-slate-600 mt-2">
              {chapter.description}
            </p>
          )}
        </div>
      ) : null}

      <div className="relative mt-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search topics by name..."
          className="pl-10 bg-white border-slate-200 shadow-sm h-12 text-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl bg-slate-200/50" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-900 bg-red-950/50 text-red-200 mt-4">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-semibold">Error</h4>
            <p className="text-sm opacity-90 mt-1">
              Failed to load topics. {error?.message || "Please try again later."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && topics.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl bg-slate-50 mt-4">
          <Hash className="mx-auto h-12 w-12 text-slate-400 mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-900">No Topics Found</h3>
          <p className="text-slate-500">
            {searchTerm ? `No topics match "${searchTerm}".` : "No topics have been added to this chapter yet."}
          </p>
        </div>
      )}

      {!isLoading && !isError && topics.length > 0 && (
        <TopicAccordion topics={topics} />
      )}
    </div>
  );
}
