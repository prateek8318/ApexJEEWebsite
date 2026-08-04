"use client";

import { ChevronDown, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  subjects: any[];
  chapters: any[];
  topics: any[];
  currentSubjectId: string;
  currentChapterId: string;
  currentTopicId: string;
  onSubjectChange: (id: string) => void;
  onChapterChange: (id: string) => void;
  onTopicChange: (id: string) => void;
  progress: number;
  watched: number;
  total: number;
}

export default function TopNav({
  subjects,
  chapters,
  topics,
  currentSubjectId,
  currentChapterId,
  currentTopicId,
  onSubjectChange,
  onChapterChange,
  onTopicChange,
  progress,
  watched,
  total,
}: TopNavProps) {
  const currentSubject = subjects?.find((s) => s._id === currentSubjectId);
  const currentChapter = chapters?.find((c) => c._id === currentChapterId);
  const currentTopic = topics?.find((t) => t._id === currentTopicId);

  return (
    <div className="top-nav relative z-10 flex items-center justify-between bg-[#13151f] border-b border-[#2a2d3d] px-6 h-14 w-full text-white">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 mr-2 font-medium">JUMP TO:</span>
        
        {/* Subject Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2130] border border-[#2a2d3d] text-sm cursor-pointer hover:bg-[#25293d] transition-colors">
              <span className="text-blue-400">⚡</span>
              <span className="font-medium text-gray-200 truncate max-w-[120px]">{currentSubject?.name || "Subject"}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1e2130] border-[#2a2d3d] text-gray-200">
            {subjects?.map((subject) => (
              <DropdownMenuItem
                key={subject._id}
                className="hover:bg-[#2a2d3d] cursor-pointer"
                onClick={() => onSubjectChange(subject._id)}
              >
                {subject.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-gray-500">›</span>

        {/* Chapter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2130] border border-[#2a2d3d] text-sm cursor-pointer hover:bg-[#25293d] transition-colors">
              <span className="text-green-400">✳</span>
              <span className="font-medium text-gray-200 truncate max-w-[150px]">{currentChapter?.title || "Chapter"}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1e2130] border-[#2a2d3d] text-gray-200 max-w-[300px]">
            {chapters?.map((chapter) => (
              <DropdownMenuItem
                key={chapter._id}
                className="hover:bg-[#2a2d3d] cursor-pointer truncate"
                onClick={() => onChapterChange(chapter._id)}
              >
                {chapter.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-gray-500">›</span>

        {/* Topic Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2130] border border-[#2a2d3d] text-sm cursor-pointer hover:bg-[#25293d] transition-colors">
              <BookOpen size={14} className="text-pink-400" />
              <span className="font-medium text-gray-200 truncate max-w-[150px]">{currentTopic?.title || "Topic"}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1e2130] border-[#2a2d3d] text-gray-200 max-w-[300px]">
            {topics?.map((topic) => (
              <DropdownMenuItem
                key={topic._id}
                className="hover:bg-[#2a2d3d] cursor-pointer truncate"
                onClick={() => onTopicChange(topic._id)}
              >
                {topic.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-gray-400 tracking-wide">
          <span className="text-white">{watched}</span> / {total} WATCHED
        </span>
        <div className="w-[140px] h-2 bg-[#25293d] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
