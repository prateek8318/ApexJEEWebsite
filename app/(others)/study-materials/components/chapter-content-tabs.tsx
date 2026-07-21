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
import type { SelfLearningChapter } from "@/types/SelfLearning";

type Props = {
  chapter: SelfLearningChapter;
};

const ChapterContentTabs = ({ chapter }: Props) => (
  <Tabs defaultValue="videos" className="mt-6">
    <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-slate-200 bg-transparent p-0">
      <TabTrigger
        value="videos"
        icon={<Video className="size-4" />}
        label="Video Lectures"
        count={chapter.videoCount}
      />
      <TabTrigger
        value="notes"
        icon={<FileText className="size-4" />}
        label="Revision Notes"
        count={chapter.revisionNotesCount}
      />
      <TabTrigger
        value="practice"
        icon={<Pencil className="size-4" />}
        label="Practice Questions"
        count={chapter.practiceQuestionsCount}
      />
    </TabsList>

    <TabsContent value="videos" className="mt-6 space-y-8">
      {chapter.videoSections.length === 0 ? (
        <EmptyState message="No video lectures available for this chapter yet." />
      ) : (
        chapter.videoSections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-4 font-serif text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.videos.map((video) => (
                <VideoLectureCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        ))
      )}
    </TabsContent>

    <TabsContent value="notes" className="mt-6">
      <EmptyState
        message={`${chapter.revisionNotesCount} revision notes available for ${chapter.title}.`}
        actionLabel="View All Notes"
      />
    </TabsContent>

    <TabsContent value="practice" className="mt-6">
      <EmptyState
        message={`${chapter.practiceQuestionsCount} practice questions available for ${chapter.title}.`}
        actionLabel="Start Practice"
      />
    </TabsContent>
  </Tabs>
);

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
      "group relative h-11 rounded-none border-0 bg-transparent px-4 shadow-none",
      "text-slate-500 hover:text-slate-700",
      "data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none",
      "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-blue-600 after:transition-transform",
      "data-[state=active]:after:scale-x-100",
    )}
  >
    <span className="flex items-center gap-2 text-sm font-medium">
      {icon}
      {label}
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 group-data-[state=active]:bg-amber-100 group-data-[state=active]:text-amber-700">
        {count}
      </span>
    </span>
  </TabsTrigger>
);

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
};

const EmptyState = ({ message, actionLabel }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
    <p className="max-w-md text-sm text-slate-500">{message}</p>
    {actionLabel && (
      <button
        type="button"
        className="mt-4 rounded-lg bg-[#0a1628] px-5 py-2 text-sm font-medium text-white hover:bg-[#0f1f3d]"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default ChapterContentTabs;
