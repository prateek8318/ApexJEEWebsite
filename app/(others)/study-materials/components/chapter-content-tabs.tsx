"use client";

import { FileText, Pencil, Video, BookOpen, Upload, Download, Eye, Heart } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/ui/tabs";
import { cn } from "@lib/utils";
import VideoLectureCard from "./video-lecture-card";
import type { Chapter } from "@/types/user-api";
import { useQuery } from "@tanstack/react-query";
import { userTopicApi } from "@/lib/api/user/topic";
import { userVideoApi } from "@/lib/api/user/video";
import { userNoteApi } from "@/lib/api/user/note";
import { userTestApi } from "@/lib/api/user/test";
import { useRouter } from "next/navigation";

type Props = {
  chapter: Chapter;
};

const ChapterContentTabs = ({ chapter }: Props) => {
  const { data: topicsData } = useQuery({
    queryKey: ["topics", "chapter", chapter._id],
    queryFn: () => userTopicApi.getTopicsByChapter(chapter._id as string),
    enabled: !!chapter._id,
  });

  const topics = topicsData?.data || [];

  return (
    <Tabs defaultValue="videos" className="mt-6">
      <div className="bg-white rounded-xl border border-slate-200 p-2 mb-6 shadow-sm">
        <TabsList className="h-auto w-full justify-between gap-2 rounded-none border-0 bg-transparent p-0 flex">
          <TabTrigger
            value="videos"
            icon={<Video className="size-4" />}
            label="Video Lectures"
            count={chapter.videosCount || 0}
          />
          <div className="w-px h-8 bg-slate-200 self-center" />
          <TabTrigger
            value="notes"
            icon={<FileText className="size-4" />}
            label="Revision Notes"
            count={chapter.notesCount || 0}
          />
          <div className="w-px h-8 bg-slate-200 self-center" />
          <TabTrigger
            value="practice"
            icon={<Pencil className="size-4" />}
            label="Practice Questions"
            count={chapter.questionsCount || 0}
          />
        </TabsList>
      </div>

      <TabsContent value="videos" className="mt-6 space-y-8">
        {topics.length === 0 ? (
          <EmptyState message="No topics available for this chapter yet." />
        ) : (
          topics.map((topic) => (
            <TopicVideoSection key={topic._id} topic={topic} />
          ))
        )}
      </TabsContent>

      <TabsContent value="notes" className="mt-6 space-y-8">
        {topics.length === 0 ? (
          <EmptyState message="No topics available for this chapter yet." />
        ) : (
          topics.map((topic) => (
            <TopicNoteSection key={topic._id} topic={topic} />
          ))
        )}
      </TabsContent>

      <TabsContent value="practice" className="mt-6 space-y-8">
        {topics.length === 0 ? (
          <EmptyState message="No topics available for this chapter yet." />
        ) : (
          topics.map((topic) => (
            <TopicTestSection key={topic._id} topic={topic} />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

const TopicVideoSection = ({ topic }: { topic: any }) => {
  const { data: videosData } = useQuery({
    queryKey: ["videos", "topic", topic._id],
    queryFn: () => userVideoApi.getVideosByTopic(topic._id),
    enabled: !!topic._id,
  });

  const videos = videosData?.data || [];

  return (
    <section>
      <h2 className="mb-4 font-serif text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
        {topic.title}
      </h2>
      {videos.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No videos available for this topic.</p>
      ) : (
        <div className="space-y-3">
          {videos.map((video: any) => (
            <VideoLectureCard key={video._id} video={video as any} topicId={topic._id} />
          ))}
        </div>
      )}
    </section>
  );
};

const TopicNoteSection = ({ topic }: { topic: any }) => {
  const { data: notesData } = useQuery({
    queryKey: ["notes", "topic", topic._id],
    queryFn: () => userNoteApi.getNotesByTopic(topic._id),
    enabled: !!topic._id,
  });

  const notes = notesData?.data || [];

  return (
    <section>
      {notes.length === 0 ? null : (
        <div className="space-y-4">
          {notes.map((note: any) => {
            const isTheory = note.type === 'notes' || note.title?.toLowerCase().includes('theory');
            
            return (
              <div key={note._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-slate-200 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md gap-4">
                <div className="flex items-start gap-5 flex-1 w-full">
                  <div className={cn("p-4 rounded-xl flex items-center justify-center shrink-0 border", isTheory ? "bg-blue-50/50 border-blue-100 text-blue-500" : "bg-yellow-50/50 border-yellow-100 text-yellow-500")}>
                    {isTheory ? <BookOpen strokeWidth={1.5} className="size-8" /> : <Upload strokeWidth={1.5} className="size-8" />}
                  </div>
                  <div className="min-w-0">
                    <span className={cn("text-[9px] font-bold tracking-widest uppercase mb-1.5 block", isTheory ? "text-blue-500" : "text-yellow-500")}>{isTheory ? "THEORY" : "FORMULA"}</span>
                    <h3 className="font-serif font-bold text-[17px] text-slate-800 tracking-wide mb-1.5">{note.title}</h3>
                    <p className="text-[11px] font-medium text-slate-400">
                      {note.pageCount ? String(note.pageCount).padStart(2, '0') : "32"} pages &nbsp;•&nbsp; 3.1 MB &nbsp;•&nbsp; Updated Apr 2025
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {note.tags.map((tag: string, i: number) => (
                          <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-44 shrink-0 mt-4 sm:mt-0">
                  <button onClick={() => window.open(note.fileUrl, '_blank')} className="w-full flex items-center justify-center gap-2 h-9 text-[11px] font-bold bg-[#111827] hover:bg-[#1e293b] transition-colors text-white rounded-lg shadow-sm">
                    <Eye className="size-3.5" />
                    View
                  </button>
                  <button onClick={() => window.open(note.fileUrl, '_blank')} className="w-full flex items-center justify-center gap-2 h-9 text-[11px] font-bold bg-[#fffbeb] hover:bg-[#fef3c7] text-[#d97706] border border-[#fde68a] transition-colors rounded-lg shadow-sm">
                    <Download className="size-3.5" />
                    Download
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 h-9 text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors rounded-lg shadow-sm">
                    <Heart className="size-3.5 text-slate-400" />
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const TopicTestSection = ({ topic }: { topic: any }) => {
  const router = useRouter();
  const { data: testsData } = useQuery({
    queryKey: ["practice-tests", "topic", topic._id],
    queryFn: () => userTestApi.getPracticeTestsByTopic(topic._id),
    enabled: !!topic._id,
  });

  const tests = testsData?.data || [];

  return (
    <section>
      <h2 className="mb-4 font-serif text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
        {topic.title}
      </h2>
      {tests.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No practice tests available for this topic.</p>
      ) : (
        <div className="space-y-3">
          {tests.map((test: any) => (
            <div key={test._id} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Pencil className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-800">{test.title}</h3>
                  <p className="text-xs text-slate-500">{test.totalQuestions} Questions • {test.durationMins} Mins</p>
                </div>
              </div>
              <button 
                onClick={() => router.push(`/practice-questions?testId=${test._id}`)} 
                className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-lg"
              >
                Practice
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

type TabTriggerProps = {
  value: string;
  icon: React.ReactNode;
  label: string;
  count: number;
};

const TabTrigger = ({ value, icon, label, count }: TabTriggerProps) => (
  <TabsTrigger
    value={value}
    className={cn(
      "group relative flex flex-1 items-center justify-center gap-2 h-12 rounded-lg border-0 bg-transparent px-4 shadow-none transition-colors",
      "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
      "data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none",
      "after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-blue-600 after:transition-transform",
      "data-[state=active]:after:scale-x-100",
    )}
  >
    <span className="flex items-center gap-2 text-sm font-semibold">
      {icon}
      {label}
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 group-data-[state=active]:bg-yellow-100 group-data-[state=active]:text-yellow-700 shadow-sm border border-slate-200/60 group-data-[state=active]:border-yellow-200">
        {count}
      </span>
    </span>
  </TabsTrigger>
);

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState = ({ message, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
    <p className="max-w-md text-sm text-slate-500">{message}</p>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 rounded-lg bg-[#0a1628] px-5 py-2 text-sm font-medium text-white hover:bg-[#0f1f3d]"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default ChapterContentTabs;
