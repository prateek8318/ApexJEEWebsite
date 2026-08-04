"use client";

import { FileText, Pencil, Video } from "lucide-react";
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
  const router = useRouter();
  const { data: topicsData } = useQuery({
    queryKey: ["topics", "chapter", chapter._id],
    queryFn: () => userTopicApi.getTopicsByChapter(chapter._id as string),
    enabled: !!chapter._id,
  });

  const topics = topicsData?.data || [];

  return (
    <Tabs defaultValue="videos" className="mt-6">
      <TabsList className="h-auto w-full justify-start gap-3 rounded-none border-0 bg-transparent p-0 flex flex-wrap">
        <TabTrigger
          value="videos"
          icon={<Video className="size-4" />}
          label="Video Lectures"
          count={chapter.videosCount || 0}
        />
        <TabTrigger
          value="notes"
          icon={<FileText className="size-4" />}
          label="Revision Notes"
          count={chapter.notesCount || 0}
        />
        <TabTrigger
          value="practice"
          icon={<Pencil className="size-4" />}
          label="Practice Questions"
          count={chapter.questionsCount || 0}
        />
      </TabsList>

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
      <h2 className="mb-4 font-serif text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
        {topic.title}
      </h2>
      {notes.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No notes available for this topic.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note: any) => (
            <div key={note._id} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-800">{note.title}</h3>
                  <p className="text-xs text-slate-500 capitalize">{note.type}</p>
                </div>
              </div>
              <button onClick={() => window.open(note.fileUrl, '_blank')} className="px-4 py-1.5 text-sm font-medium bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700 rounded-lg">
                Download
              </button>
            </div>
          ))}
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
      "group flex items-center gap-2 h-10 px-5 rounded-full border border-slate-200 bg-white shadow-sm transition-all",
      "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      "data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600 data-[state=active]:shadow-md"
    )}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
    <span className={cn(
      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
      "bg-slate-100 text-slate-500",
      "group-data-[state=active]:bg-indigo-500 group-data-[state=active]:text-white"
    )}>
      {count}
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
