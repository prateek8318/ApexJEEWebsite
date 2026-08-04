"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userTopicApi } from "@/lib/api/user/topic";
import { userVideoApi } from "@/lib/api/user/video";
import { userSubjectApi } from "@/lib/api/user/subject";
import TopNav from "./components/TopNav";
import VideoPlayer from "./components/VideoPlayer";
import LectureControls from "./components/LectureControls";
import MyNotes from "./components/MyNotes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function VideoLectureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const topicId = searchParams.get("topicId");

  const [currentIndex, setCurrentIndex] = useState(0);

  // Queries for Auto-selection
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => userSubjectApi.getAllSubjects(),
    enabled: !topicId, // only fetch if we need to auto-redirect
  });
  const subjects = subjectsData?.data || [];

  const { data: chaptersData } = useQuery({
    queryKey: ["chapters", "subject", subjects[0]?._id],
    queryFn: () => userSubjectApi.getChaptersBySubject(subjects[0]._id),
    enabled: !topicId && !!subjects[0]?._id,
  });
  const chapters = chaptersData?.data || [];

  const { data: topicsData } = useQuery({
    queryKey: ["topics", "chapter", chapters[0]?._id],
    queryFn: () => userTopicApi.getTopicsByChapter(chapters[0]._id),
    enabled: !topicId && !!chapters[0]?._id,
  });
  const topics = topicsData?.data || [];

  useEffect(() => {
    if (!topicId && topics.length > 0) {
      router.replace(`/video-lectures?topicId=${topics[0]._id}`);
    }
  }, [topicId, topics, router]);

  const { data: topicData, isLoading: isTopicLoading } = useQuery({
    queryKey: ["topicStats", topicId],
    queryFn: () => userTopicApi.getTopicStats(topicId!),
    enabled: !!topicId,
  });
  const topicStats = topicData?.data;

  const { data: videosData, isLoading: isVideosLoading } = useQuery({
    queryKey: ["videos", "topic", topicId],
    queryFn: () => userVideoApi.getVideosByTopic(topicId!),
    enabled: !!topicId,
  });
  const videos = videosData?.data || [];

  const markWatchedMutation = useMutation({
    mutationFn: (videoId: string) => userVideoApi.markVideoWatched(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", "topic", topicId] });
      queryClient.invalidateQueries({ queryKey: ["topicStats", topicId] });
    },
  });

  const incrementWatchCountMutation = useMutation({
    mutationFn: (videoId: string) => userVideoApi.incrementWatchCount(videoId),
  });

  const toggleFavouriteMutation = useMutation({
    mutationFn: (videoId: string) => userVideoApi.toggleFavourite(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", "topic", topicId] });
    },
  });

  const toggleFlagMutation = useMutation({
    mutationFn: (params: { videoId: string, isFlagged: boolean }) => 
      params.isFlagged 
        ? userVideoApi.unflagVideo(params.videoId) 
        : userVideoApi.flagVideo(params.videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", "topic", topicId] });
    },
  });

  useEffect(() => {
    // If a videoId was passed in the URL, try to set it as current
    const videoId = searchParams.get("videoId");
    if (videoId && videos.length > 0) {
      const idx = videos.findIndex((v: any) => v._id === videoId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [videos, searchParams]);

  const lecture = videos[currentIndex];

  useEffect(() => {
    if (lecture?._id) {
      incrementWatchCountMutation.mutate(lecture._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lecture?._id]);

  if (!topicId) {
    if (topicsData === undefined && subjectsData === undefined) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <Skeleton className="w-[800px] h-[500px] rounded-2xl" />
        </div>
      );
    }
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
        <p className="text-slate-600">No topic available.</p>
        <Button onClick={() => router.push("/study-materials")}>Go to Study Materials</Button>
      </div>
    );
  }

  if (isTopicLoading || isVideosLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Skeleton className="w-[800px] h-[500px] rounded-2xl" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
        <p className="text-slate-600">No videos available for this topic.</p>
        <Button variant="outline" onClick={() => router.push("/study-materials")}>Back</Button>
      </div>
    );
  }

  // API returning { watch: { status: 'watched' | 'in_progress', isCompleted: boolean } } inside each video object
  const isWatched = lecture?.watch?.isCompleted || false;
  
  const progressPercent = topicStats?.progress?.percent || 0;
  const completedVideos = topicStats?.progress?.completedVideos || 0;
  const totalVideos = topicStats?.progress?.totalVideos || videos.length;

  const subjectName = typeof topicStats?.topic?.subject === 'object' ? (topicStats.topic.subject as any).name : 'Subject';
  const chapterName = typeof topicStats?.topic?.chapter === 'object' ? (topicStats.topic.chapter as any).title : 'Chapter';

  const handleMarkWatched = () => {
    if (!lecture) return;
    markWatchedMutation.mutate(lecture._id);
  };

  const handleFavourite = () => {
    if (!lecture) return;
    toggleFavouriteMutation.mutate(lecture._id);
  };

  const handleFlag = () => {
    if (!lecture) return;
    toggleFlagMutation.mutate({ videoId: lecture._id, isFlagged: !!lecture.isFlagged });
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        subjects={subjects}
        chapters={chapters}
        topics={topics}
        currentSubjectId={topicStats?.topic?.subject?._id || subjects[0]?._id}
        currentChapterId={topicStats?.topic?.chapter?._id || chapters[0]?._id}
        currentTopicId={topicId}
        onSubjectChange={(id) => {
          // When subject changes, maybe we just set a state or redirect to its first topic
        }}
        onChapterChange={(id) => {}}
        onTopicChange={(id) => router.push(`/video-lectures?topicId=${id}`)}
        progress={progressPercent}
        watched={completedVideos}
        total={totalVideos}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col">
          {/* Mock Video Player using Youtube embed if available, else static placeholder */}
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
            {lecture?.youtubeUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={
                  (() => {
                    const url = lecture.youtubeUrl;
                    let videoId = "";
                    if (url.includes("youtu.be/")) {
                      videoId = url.split("youtu.be/")[1]?.split("?")[0];
                    } else if (url.includes("watch?v=")) {
                      videoId = url.split("watch?v=")[1]?.split("&")[0];
                    }
                    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                  })()
                }
                title={lecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <VideoPlayer />
            )}
          </div>
          
          <LectureControls
            onPrev={handlePrev}
            onNext={handleNext}
            onMarkWatched={handleMarkWatched}
            onFavourite={handleFavourite}
            onFlag={handleFlag}
            isWatched={isWatched}
            isFavourite={lecture?.isFavourite}
            isFlagged={lecture?.isFlagged}
            lectureNumber={currentIndex + 1}
            lectureTitle={lecture?.title || "Video"}
            duration={lecture?.durationMinutes ? `${lecture.durationMinutes} min` : "Unknown"}
          />
          <div className="mt-4">
            <MyNotes key={currentIndex} />
          </div>
        </main>
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 bg-[#0f111a] border-l border-gray-800 overflow-y-auto text-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span>
               <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Now Watching</span>
            </div>
            <span className="text-xs text-gray-500">{videos.length} lectures</span>
          </div>
          <div className="px-4 py-3">
             <h3 className="text-sm font-semibold">{subjectName}</h3>
             <p className="text-xs text-yellow-500 mt-1">{chapterName}</p>
          </div>
          <ul className="flex-1 overflow-y-auto px-2 mt-2 space-y-1">
            {videos.map((l: any, i: number) => {
              const done = l.watch?.isCompleted;
              const active = i === currentIndex;
              return (
                <li
                  key={l._id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer relative ${active ? "bg-[#1c1f2e]" : "hover:bg-[#1a1d2d]"} ${done ? "opacity-70" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  {/* Timeline line */}
                  {i !== videos.length - 1 && (
                     <div className="absolute left-6 top-10 bottom-[-10px] w-px bg-gray-800" />
                  )}
                  
                  <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${done ? "bg-teal-500 border-teal-500 text-white" : active ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-600 text-gray-400 bg-[#0f111a]"}`}>
                    {done ? (
                      <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-sm leading-tight line-clamp-2 ${active ? "text-yellow-500 font-medium" : "text-gray-200"}`}>{l.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] text-gray-500">{l.durationMinutes ? `${l.durationMinutes} min` : "Unknown"}</span>
                       <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-900/40 text-blue-400 uppercase tracking-wider">Lecture</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default function VideoLecturePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Skeleton className="w-[800px] h-[500px]" /></div>}>
      <VideoLectureContent />
    </Suspense>
  );
}
