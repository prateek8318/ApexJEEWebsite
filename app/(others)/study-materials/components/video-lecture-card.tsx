import {
  CheckCircle2,
  FileText,
  Play,
  Heart,
  Flag
} from "lucide-react";
import type { Video, Topic } from "@/types/user-api";
import { useRouter } from "next/navigation";

type Props = {
  video: Video;
  topicId?: string;
};

const VideoLectureCard = ({ video, topicId }: Props) => {
  const router = useRouter();
  const isWatched = !!video.watch?.isCompleted;
  const watchProgress = video.watch?.percent ?? 0;
  const isFavourite = !!video.isFavourite;
  const isFlagged = !!video.isFlagged;

  const statusBadge = () => {
    if (isWatched) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white">
          <CheckCircle2 className="size-3" />
          Watched
        </span>
      );
    }

    if (watchProgress > 0) {
      return (
        <span className="rounded-full bg-[#f59e0b] px-2 py-1 text-[9px] font-bold tracking-wider text-black">
          {watchProgress}% watched
        </span>
      );
    }

    return null;
  };

  const topicName = typeof video.topic === 'object' ? (video.topic as Topic).title : 'Topic';
  const durationText = video.durationMinutes ? `${Math.floor(video.durationMinutes/60)}:${String(video.durationMinutes%60).padStart(2,'0')}` : '38:24';

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row items-center">
      <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-[#111827] sm:w-[220px] aspect-video">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Play className="size-4 fill-white text-white ml-1" />
            </div>
          </div>
        )}

        <span className="absolute top-2 left-2 rounded-md bg-[#283b63] border border-white/10 px-2 py-1 text-[9px] font-bold tracking-wider text-white">
          Lecture
        </span>

        {statusBadge() && (
          <div className="absolute top-2 right-2">{statusBadge()}</div>
        )}

        <span className="absolute right-2 bottom-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
          {durationText}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center h-full">
        <div>
          <h3 className="text-base font-bold text-slate-800">{video.title}</h3>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">{topicName}</span>
            <span className="rounded bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600">Easy</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">JEE 2022</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            className="flex-1 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#111827] px-6 text-[13px] font-bold text-white transition-colors hover:bg-[#1e293b]"
            onClick={() => {
              const tId = topicId || (typeof video.topic === 'object' ? (video.topic as Topic)._id : video.topic);
              router.push(`/video-lectures?topicId=${tId}&videoId=${video._id}`);
            }}
          >
            <Play className="size-4 fill-white" />
            Watch
          </button>
          
          <button
            className="flex-1 flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
            onClick={() => video.noteUrl && window.open(video.noteUrl, '_blank')}
          >
            <FileText className="size-4 text-slate-400" />
            Notes
          </button>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100"
            aria-label={isFavourite ? "Bookmarked video" : "Bookmark video"}
          >
            <Heart className={`size-4 ${isFavourite ? "text-red-500" : "text-slate-400"}`} />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100"
            aria-label={isFlagged ? "Flagged video" : "Flag video"}
          >
            <Flag className={`size-4 ${isFlagged ? "text-red-500" : "text-slate-400"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoLectureCard;
