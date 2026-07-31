"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Topic, Video, Note } from "@/types/user-api";
import { userVideoApi } from "@lib/api/user/video";
import { userNoteApi } from "@lib/api/user/note";
import { PlayCircle, FileText, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TopicAccordionProps {
  topics: Topic[];
}

export default function TopicAccordion({ topics }: TopicAccordionProps) {
  const [openTopic, setOpenTopic] = useState<string | undefined>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      try {
        videoId = new URL(url).searchParams.get('v') || '';
      } catch (e) {
        // invalid URL
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  useEffect(() => {
    if (!openTopic) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const [videosRes, notesRes] = await Promise.all([
          userVideoApi.getVideosByTopic(openTopic),
          userNoteApi.getNotesByTopic(openTopic),
        ]);
        setVideos(videosRes.data || []);
        setNotes(notesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch topic content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [openTopic]);

  if (topics.length === 0) {
    return null; // Handled by parent
  }

  return (
    <>
    <Accordion 
      type="single" 
      collapsible 
      className="w-full space-y-4 mt-4"
      value={openTopic}
      onValueChange={setOpenTopic}
    >
      {topics.map((topic, index) => (
        <AccordionItem 
          key={topic._id} 
          value={topic._id} 
          className="border border-slate-200 rounded-lg bg-white overflow-hidden"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4 text-left">
              <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 font-medium text-sm border border-blue-100">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {topic.title}
              </h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="space-y-6 mt-4">
                {/* Videos Section */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                    Videos ({videos.length})
                  </h4>
                  {videos.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No videos available for this topic.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {videos.map(video => (
                        <button 
                          key={video._id} 
                          onClick={() => setPlayingVideo(video)}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-md hover:border-blue-300 hover:shadow-sm transition-all group text-left"
                        >
                          <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50">
                            <PlayCircle className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{video.title}</p>
                            {video.durationMinutes && <p className="text-xs text-slate-500">{video.durationMinutes} mins</p>}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    Study Notes ({notes.length})
                  </h4>
                  {notes.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No notes available for this topic.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {notes.map(note => (
                        <a 
                          key={note._id} 
                          href={note.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-md hover:border-orange-300 hover:shadow-sm transition-all group"
                        >
                          <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-50">
                            <FileText className="h-5 w-5 text-slate-400 group-hover:text-orange-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{note.title}</p>
                            {note.fileType && <p className="text-xs text-slate-500 uppercase">{note.fileType}</p>}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>

    <Dialog open={!!playingVideo} onOpenChange={(open) => !open && setPlayingVideo(null)}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
        <DialogHeader className="p-4 bg-slate-900 border-b border-slate-800 text-white">
          <DialogTitle className="text-white">{playingVideo?.title}</DialogTitle>
          {playingVideo?.description && (
            <DialogDescription className="text-slate-400">
              {playingVideo.description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="w-full aspect-video bg-black flex items-center justify-center">
          {playingVideo ? (
            <iframe 
              src={getEmbedUrl(playingVideo.youtubeUrl)} 
              title={playingVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
