"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userSubjectApi } from "@/lib/api/user/subject";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download, FileText, Zap } from "lucide-react";

export default function RevisionNotesPage() {
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all active subjects
  const { data: subjectsData, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => userSubjectApi.getAllSubjects(),
  });
  const subjects = subjectsData?.data || [];

  useEffect(() => {
    if (subjects.length > 0 && !activeSubjectId) {
      setActiveSubjectId(subjects[0]._id);
    }
  }, [subjects, activeSubjectId]);

  // Fetch chapters for active subject
  const { data: chaptersData, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["chapters", "subject", activeSubjectId],
    queryFn: () => userSubjectApi.getChaptersBySubject(activeSubjectId!),
    enabled: !!activeSubjectId,
  });
  
  const rawChapters = chaptersData?.data || [];
  
  // Client-side search filtering
  const chapters = rawChapters.filter((ch: any) => 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSubject = subjects.find((s: any) => s._id === activeSubjectId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="w-full space-y-6">
          
          {/* Header Texts */}
          <div className="mb-2">
            <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Revision Notes & Formula Sheets</h1>
            <p className="text-[13px] text-slate-500 mt-1">Chapter-wise notes & formula PDFs for Physics and Mathematics</p>
          </div>

          {/* Dark Hero Banner */}
          <div className="bg-[#111827] rounded-[20px] p-8 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f59e0b] opacity-[0.03] blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            
            <div className="relative z-10 space-y-3 flex-1">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#f59e0b] uppercase">IIT JEE PREPARATION • APEXJEE</p>
              <h2 className="text-3xl md:text-4xl text-white font-serif italic tracking-wide">Revision Notes & Formula Sheets</h2>
              <p className="text-slate-400 text-xs max-w-lg leading-relaxed pt-2">
                Download chapter-wise revision notes and formula sheets for Physics and Mathematics. Single-click bulk download available for the entire subject.
              </p>
            </div>

            <div className="flex gap-4 mt-6 md:mt-0 relative z-10 shrink-0">
              <div className="bg-[#1f2937] border border-slate-700/50 rounded-xl px-5 py-4 min-w-[120px] text-center shadow-inner">
                <div className="text-[22px] font-bold text-[#f59e0b] mb-1">33</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total<br/>Chapters</div>
              </div>
              <div className="bg-[#1f2937] border border-slate-700/50 rounded-xl px-5 py-4 min-w-[120px] text-center shadow-inner">
                <div className="text-[22px] font-bold text-[#f59e0b] mb-1">87 MB</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Notes<br/>Library</div>
              </div>
            </div>
          </div>

          {/* Tabs and Bulk Download */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200/60 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            
            {/* Subject Tabs */}
            <div className="flex gap-1 w-full xl:w-auto overflow-x-auto p-1">
              {isSubjectsLoading ? (
                <Skeleton className="h-12 w-48 rounded-xl" />
              ) : (
                subjects.map((subject: any) => {
                  const isActive = activeSubjectId === subject._id;
                  return (
                    <button
                      key={subject._id}
                      onClick={() => setActiveSubjectId(subject._id)}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${
                        isActive 
                          ? "bg-slate-50 text-slate-900 shadow-sm border border-slate-200/50" 
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                      }`}
                    >
                      {subject.name === "Physics" && <Zap size={16} className={isActive ? "text-[#f59e0b] fill-[#f59e0b]/20" : ""} />}
                      {subject.name}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ml-1 ${
                        isActive ? "bg-[#fffbeb] text-[#d97706] border border-[#fef3c7]" : "bg-slate-100 text-slate-400"
                      }`}>
                        {subject.name === activeSubject?.name ? rawChapters.length : "0"} chapters
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bulk Download Banner */}
            <div className="bg-[#1e293b] rounded-xl p-3 flex flex-col xl:flex-row items-stretch xl:items-center gap-4 w-full xl:w-auto shadow-inner overflow-hidden">
              <div className="flex items-center gap-3 pl-2">
                <div className="size-8 rounded-lg shrink-0 bg-[#f59e0b] text-[#78350f] flex items-center justify-center">
                  <Download size={16} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-[13px] font-bold truncate">Download Complete {activeSubject?.name || "Subject"} Bundle</h4>
                  <p className="text-slate-400 text-[10px] truncate">{rawChapters.length} chapters • Notes: 430 pages (45.3 MB) • Formula Sheets: 65 pages (10.6 MB)</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto mt-2 xl:mt-0">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#78350f] px-4 py-2 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap">
                  <Download size={14} />
                  <span>All {activeSubject?.name || "Subject"} Revision Notes <span className="opacity-75 font-medium ml-1">45.3 MB</span></span>
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-slate-600 text-white px-4 py-2 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap">
                  <Download size={14} />
                  <span>All {activeSubject?.name || "Subject"} Formula Sheets <span className="opacity-75 font-medium ml-1">10.6 MB</span></span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search chapters..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-white text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b] transition-all shadow-sm"
              />
            </div>
            <button className="w-full sm:w-auto bg-[#f59e0b] text-[#78350f] px-5 py-2.5 rounded-xl text-[12px] font-bold hover:bg-[#d97706] transition-colors shadow-sm">
              All Chapters
            </button>
          </div>

          {/* Chapters Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#111827]">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest w-24 text-center">No.</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Chapter</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest w-64">Revision Notes PDF</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest w-64">Formula Sheet PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isChaptersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-5 text-center"><Skeleton className="size-8 rounded-full mx-auto" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-5 w-48 mb-2" /><Skeleton className="h-3 w-64" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-10 w-full rounded-lg" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-10 w-full rounded-lg" /></td>
                      </tr>
                    ))
                  ) : chapters.length > 0 ? (
                    chapters.map((chapter: any, index: number) => (
                      <tr key={chapter._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center justify-center size-8 rounded-full bg-slate-100 text-slate-500 font-bold text-[12px] group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold text-[14px] text-slate-800 mb-1">{chapter.title}</div>
                          <div className="text-[10px] font-medium text-slate-400">
                            {30 + (index % 10)} pages total • {(2.0 + index * 0.1).toFixed(1)} MB notes • 0.6 MB formula
                          </div>
                        </td>
                        <td className="px-6 py-5 pr-2">
                          <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group/btn">
                            <div className="flex items-center gap-2.5">
                              <Download size={14} className="text-slate-500 group-hover/btn:text-slate-700" />
                              <span className="text-[12px] font-bold text-slate-700">Revision Notes</span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">{20 + (index % 5)}pp — {(2.0 + index * 0.1).toFixed(1)} MB</span>
                          </button>
                        </td>
                        <td className="px-6 py-5 pl-2">
                          <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-200 transition-all group/btn">
                            <div className="flex items-center gap-2.5">
                              <Download size={14} className="text-blue-500 group-hover/btn:text-blue-600" />
                              <span className="text-[12px] font-bold text-blue-600">Formula Sheet</span>
                            </div>
                            <span className="text-[10px] font-medium text-blue-400/80">{4 + (index % 3)}pp — 0.6 MB</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <FileText size={48} className="mx-auto mb-4 text-slate-200" strokeWidth={1} />
                        <p className="text-slate-500 font-medium">No chapters found for this subject.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}