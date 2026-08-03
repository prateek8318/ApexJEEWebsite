"use client";

import React, { useState } from "react";
import { FileText, Search, Upload, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi } from "@/lib/api/admin/notes";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { toast } from "sonner";
import { Note as NoteType, Subject, Chapter } from "@/types/admin-api";

export function NotesTab() {
  const [search, setSearch] = useState("");
  
  // Form States
  const [title, setTitle] = useState("");
  const [type, setType] = useState("notes");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [pageCount, setPageCount] = useState("0");
  const [order, setOrder] = useState("0");
  const [isPremium, setIsPremium] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const { data: notesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["admin-notes", search],
    queryFn: () => notesApi.getAllNotes({ search }),
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => subjectsApi.getAllSubjects(""),
  });

  const { data: chaptersData } = useQuery({
    queryKey: ["admin-chapters-by-subject", subject],
    queryFn: () => chaptersApi.getAllChapters({ subject }),
    enabled: !!subject,
  });

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["admin-topics-by-chapter", chapter],
    queryFn: () => topicsApi.getAllTopics({ chapter }),
    enabled: !!chapter,
  });

  const notesList = notesData?.data || [];
  const subjects = subjectsData?.data || [];
  const chapters = chaptersData?.data || [];
  const topicsList = topicsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => notesApi.createNote(formData),
    onSuccess: () => {
      toast.success("Note uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
      // Reset form
      setTitle(""); setSubject(""); setChapter(""); setTopic(""); setFile(null);
      setPageCount("0"); setOrder("0"); setIsPremium(false); setIsActive(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload note");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notesApi.deleteNote(id),
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
    },
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !chapter || !file) {
      toast.error("Please fill all required fields and select a PDF");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    if (topic) formData.append("topic", topic);
    formData.append("pageCount", pageCount);
    formData.append("order", order);
    formData.append("isPremium", String(isPremium));
    formData.append("isActive", String(isActive));
    formData.append("fileUrl", file);

    createMutation.mutate(formData);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Upload Revision Notes / PDF</h2>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Subject <span className="text-red-500">*</span></label>
              <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(""); setTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-500 focus:border-blue-500 outline-none appearance-none bg-white" required>
                <option value="">Select subject</option>
                {subjects.map((s: Subject) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Chapter <span className="text-red-500">*</span></label>
              <select value={chapter} onChange={(e) => { setChapter(e.target.value); setTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-500 focus:border-blue-500 outline-none appearance-none bg-white" required disabled={!subject}>
                <option value="">Select chapter</option>
                {chapters.map((c: Chapter) => (
                  <option key={c._id} value={c._id}>Ch {c.chapterNumber}: {c.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" disabled={isLoadingTopics || !chapter}>
                <option value="">Select topic</option>
                {topicsList.map((t: any) => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Notes Title <span className="text-red-500">*</span></label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. Magnetic Effects — Complete Theory" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Notes Type <span className="text-red-500">*</span></label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                <option value="notes">Theory Notes</option>
                <option value="formula">Formula Sheet</option>
                <option value="solved_example">Solved Examples</option>
                <option value="assignment">Assignment</option>
                <option value="solution">Solution PDF</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Total Pages</label>
              <input value={pageCount} onChange={(e) => setPageCount(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Order</label>
              <input value={order} onChange={(e) => setOrder(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">PDF File <span className="text-red-500">*</span></label>
            <div className="relative w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-[#4F46E5] hover:bg-indigo-50/30 transition-colors cursor-pointer bg-slate-50/50">
              <Paperclip size={24} className="mb-2 text-indigo-400" />
              {file ? (
                <p className="text-sm font-medium text-slate-800">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium"><span className="text-[#4F46E5]">Click to select PDF</span> or drag & drop here</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports .pdf • Max size 20MB</p>
                </>
              )}
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50 mt-2">
            <div className="flex items-center justify-between md:pr-4">
              <div>
                <label className="text-sm font-semibold text-slate-800">Premium Content</label>
                <p className="text-xs text-slate-500 mt-0.5">Require paid subscription to access this note.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between md:pl-4 md:border-l border-slate-200">
              <div>
                <label className="text-sm font-semibold text-slate-800">Active Status</label>
                <p className="text-xs text-slate-500 mt-0.5">Make this document visible to students.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
            <button type="button" onClick={() => { setTitle(""); setSubject(""); setChapter(""); setTopic(""); setFile(null); setPageCount("0"); setOrder("0"); setIsPremium(false); setIsActive(true); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">
              Clear Form
            </button>
            <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-[#F5A623] text-white font-bold text-sm rounded-lg hover:bg-orange-500 flex items-center gap-2 disabled:opacity-50">
              <Upload size={16} /> {createMutation.isPending ? "Uploading..." : "Upload PDF Notes"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Uploaded Notes</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search notes..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50/50" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center w-[40px]">S.NO.</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">TITLE</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">SUBJECT</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">TYPE</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingNotes ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-sm">Loading notes...</td></tr>
              ) : notesList.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-sm">No notes found</td></tr>
              ) : (
                notesList.map((note: NoteType, index: number) => (
                  <tr key={note._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-4 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 pr-8">
                      <span className="text-sm font-bold text-slate-700 leading-tight block max-w-sm">{note.title}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn("px-2 py-1 rounded text-[9px] font-bold", typeof note.subject === 'object' && (note.subject as Subject).name === 'Physics' ? "bg-blue-50 text-blue-500" : "bg-orange-50 text-orange-500")}>
                        {typeof note.subject === 'object' ? (note.subject as Subject).name : note.subject}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn("px-2 py-1 rounded text-[9px] font-bold capitalize", note.type === ('theory' as any) ? "bg-purple-50 text-purple-500" : "bg-yellow-50 text-yellow-600")}>
                        {note.type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => window.open(note.fileUrl, '_blank')} className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-[10px] font-bold transition-colors">View</button>
                        <button onClick={() => {if(confirm("Delete note?")) deleteMutation.mutate(note._id);}} className="px-3 py-1.5 border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 rounded text-[10px] font-bold transition-colors">Del</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
