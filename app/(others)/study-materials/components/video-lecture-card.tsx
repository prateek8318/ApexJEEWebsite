import {
  Bookmark,
  CheckCircle2,
  FileText,
  Heart,
  Play,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import type { Video, Topic } from "@/types/user-api";
import { useRouter } from "next/navigation";

type Props = {
  video: Video;
  topicId?: string;
};

const VideoLectureCard = ({ video, topicId }: Props) => {
  const router = useRouter();
  // In a real app, this would come from a user progress API.
  const isWatched = false; 
  const watchProgress = 0;

  const statusBadge = () => {
    if (isWatched) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
          <CheckCircle2 className="size-3" />
          Watched
        </span>
      );
    }

    if (watchProgress > 0) {
      return (
        <span className="rounded-md bg-orange-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
          {watchProgress}% watched
        </span>
      );
    }

    return null;
  };

  const topicName = typeof video.topic === 'object' ? (video.topic as Topic).title : 'Topic';
  const durationText = video.durationMinutes ? `${video.durationMinutes} mins` : '';

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      <div className="relative w-full shrink-0 overflow-hidden rounded-lg bg-slate-800 sm:w-[200px]">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover aspect-video" />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Play className="size-4 fill-white text-white" />
            </div>
          </div>
        )}

        <span className="absolute top-2 left-2 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
          Lecture
        </span>

        {statusBadge() && (
          <div className="absolute top-2 right-2">{statusBadge()}</div>
        )}

        {durationText && (
          <span className="absolute right-2 bottom-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {durationText}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{video.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">{topicName}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-8 gap-1.5 rounded-lg bg-[#0a1628] px-4 text-xs hover:bg-[#0f1f3d]"
              onClick={() => {
                const tId = topicId || (typeof video.topic === 'object' ? (video.topic as Topic)._id : video.topic);
                router.push(`/video-lectures?topicId=${tId}&videoId=${video._id}`);
              }}
            >
              <Play className="size-3.5" />
              Watch
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-lg border-slate-200 px-4 text-xs text-slate-600"
            >
              <FileText className="size-3.5" />
              Notes
            </Button>
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
              aria-label="Save video"
            >
              <Heart className="size-3.5" />
            </button>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
              aria-label="Bookmark video"
            >
              <Bookmark className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLectureCard;
