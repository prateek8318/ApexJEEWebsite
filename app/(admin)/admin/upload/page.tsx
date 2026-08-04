"use client";

import { useState } from "react";
import { 
  Video, FileText, Pencil, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideosTab } from "./components/videos-tab";
import { NotesTab } from "./components/notes-tab";
import { PracticeTab } from "./components/practice-tab";
import { MocksTab } from "./components/mocks-tab";
import { useQuery } from "@tanstack/react-query";
import { videosApi } from "@/lib/api/admin/videos";
import { notesApi } from "@/lib/api/admin/notes";
import { questionsApi } from "@/lib/api/admin/questions";








export default function UploadStudyMaterial() {
  const [activeTab, setActiveTab] = useState("videos");

  const { data: videosData } = useQuery({ queryKey: ["admin-videos"], queryFn: () => videosApi.getAllVideos() });
  const { data: notesData } = useQuery({ queryKey: ["admin-notes"], queryFn: () => notesApi.getAllNotes() });
  const { data: practiceQuestionsData } = useQuery({ queryKey: ["admin-questions", "practice"], queryFn: () => questionsApi.getAllQuestions({ sourceType: "practice" }) });
  const { data: mockQuestionsData } = useQuery({ queryKey: ["admin-questions", "mock"], queryFn: () => questionsApi.getAllQuestions({ sourceType: "mock" }) });


  const videosCount = videosData?.results || videosData?.data?.length || 0;
  const notesCount = notesData?.results || notesData?.data?.length || 0;
  const practiceQuestionsCount = practiceQuestionsData?.totalResult || practiceQuestionsData?.data?.length || 0;
  const mockQuestionsCount = mockQuestionsData?.totalResult || mockQuestionsData?.data?.length || 0;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-10">
      <div className="px-8 mt-8 max-w-[1400px] mx-auto space-y-6">
        
        {/* Top 4 Category Cards */}
        <div className="grid grid-cols-4 gap-6">
          <button 
            onClick={() => setActiveTab('videos')}
            className={cn(
              "p-6 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center",
              activeTab === 'videos' 
                ? "border-[#4F46E5] bg-white shadow-md ring-1 ring-[#4F46E5]" 
                : "border-slate-200 bg-white hover:border-[#4F46E5]/50 shadow-sm opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", activeTab === 'videos' ? "bg-[#0B132B] text-white" : "text-slate-500")}>
              <Video size={24} />
            </div>
            <h3 className={cn("text-base font-bold", activeTab === 'videos' ? "text-slate-800" : "text-slate-500")}>Video Lectures</h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-4">YouTube links by chapter & topic</p>
            <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full", activeTab === 'videos' ? "text-[#4F46E5] bg-indigo-50" : "text-slate-500 bg-slate-100")}>{videosCount} videos</span>
          </button>

          <button 
            onClick={() => setActiveTab('notes')}
            className={cn(
              "p-6 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center",
              activeTab === 'notes' 
                ? "border-[#4F46E5] bg-white shadow-md ring-1 ring-[#4F46E5]" 
                : "border-slate-200 bg-white hover:border-[#4F46E5]/50 shadow-sm opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", activeTab === 'notes' ? "bg-[#0B132B] text-white" : "text-slate-500")}>
              <FileText size={24} />
            </div>
            <h3 className={cn("text-base font-bold", activeTab === 'notes' ? "text-slate-800" : "text-slate-500")}>Revision Notes</h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-4">Chapter PDF notes & formula sheets</p>
            <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full", activeTab === 'notes' ? "text-orange-500 bg-orange-50" : "text-slate-500 bg-slate-100")}>{notesCount} PDFs</span>
          </button>

          <button 
            onClick={() => setActiveTab('practice')}
            className={cn(
              "p-6 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center",
              activeTab === 'practice' 
                ? "border-[#4F46E5] bg-white shadow-md ring-1 ring-[#4F46E5]" 
                : "border-slate-200 bg-white hover:border-[#4F46E5]/50 shadow-sm opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", activeTab === 'practice' ? "bg-[#0B132B] text-white" : "text-slate-500")}>
              <Pencil size={24} />
            </div>
            <h3 className={cn("text-base font-bold", activeTab === 'practice' ? "text-slate-800" : "text-slate-500")}>Practice Questions</h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-4">Chapter-wise question bank</p>
            <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full", activeTab === 'practice' ? "text-emerald-500 bg-emerald-50" : "text-slate-500 bg-slate-100")}>{practiceQuestionsCount} Qs</span>
          </button>

          <button 
            onClick={() => setActiveTab('mocks')}
            className={cn(
              "p-6 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center",
              activeTab === 'mocks' 
                ? "border-[#4F46E5] bg-white shadow-md ring-1 ring-[#4F46E5]" 
                : "border-slate-200 bg-white hover:border-[#4F46E5]/50 shadow-sm opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", activeTab === 'mocks' ? "bg-[#0B132B] text-white" : "text-slate-500")}>
              <Clock size={24} />
            </div>
            <h3 className={cn("text-base font-bold", activeTab === 'mocks' ? "text-slate-800" : "text-slate-500")}>Mock Test Questions</h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-4">Mock test question bank</p>
            <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full", activeTab === 'mocks' ? "text-purple-500 bg-purple-50" : "text-slate-500 bg-slate-100")}>{mockQuestionsCount} Qs</span>
          </button>
        </div>

        {/* -------------------- VIDEO TAB -------------------- */}
        {activeTab === 'videos' && <VideosTab />}

        {/* -------------------- NOTES TAB -------------------- */}
        {activeTab === 'notes' && <NotesTab />}

        {/* -------------------- PRACTICE TAB -------------------- */}
        {activeTab === 'practice' && <PracticeTab />}

        {/* -------------------- MOCKS TAB -------------------- */}
        {activeTab === 'mocks' && <MocksTab />}

      </div>
    </div>
  );
}
