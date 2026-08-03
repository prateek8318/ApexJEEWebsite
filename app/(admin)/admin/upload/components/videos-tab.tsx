"use client";

import React, { useState } from "react";
import { Video, Search, Plus, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { videosApi } from "@/lib/api/admin/videos";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { toast } from "sonner";
import { Video as VideoType, Subject, Chapter } from "@/types/admin-api";

export function VideosTab() {
  const [search, setSearch] = useState("");
  
  // Form States
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("0");
  const [difficulty, setDifficulty] = useState("medium");
  const [examTag, setExamTag] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: videosData, isLoading: isLoadingVideos } = useQuery({
    queryKey: ["admin-videos", search],
    queryFn: () => videosApi.getAllVideos({ search }),
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

  const videos = videosData?.data || [];
  const subjects = subjectsData?.data || [];
  const chapters = chaptersData?.data || [];
  const topicsList = topicsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => videosApi.createVideo(formData),
    onSuccess: () => {
      toast.success("Video created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      // Reset form
      setYoutubeUrl(""); setTitle(""); setSubject(""); setChapter(""); setTopic(""); setExamTag("");
      setDescription(""); setDurationMinutes("0"); setOrder("0"); setIsActive(true); setThumbnailFile(null);
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create video");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => videosApi.deleteVideo(id),
    onSuccess: () => {
      toast.success("Video deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
  });

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeUrl || !subject || !chapter) {
      toast.error("Please fill all required fields");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("youtubeUrl", youtubeUrl);
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    if (topic) formData.append("topic", topic);
    if (description) formData.append("description", description);
    formData.append("difficulty", difficulty);
    formData.append("durationMinutes", durationMinutes);
    if (examTag) formData.append("examTag", examTag);
    formData.append("order", order);
    formData.append("isActive", String(isActive));
    if (thumbnailFile) formData.append("thumbnailUrl", thumbnailFile);

    createMutation.mutate(formData);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
            <Video size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Add Video Lecture</h2>
        </div>

        <form onSubmit={handleAddVideo} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Subject <span className="text-red-500">*</span></label>
              <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(""); setTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" required>
                <option value="">Select subject</option>
                {subjects.map((s: Subject) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Chapter <span className="text-red-500">*</span></label>
              <select value={chapter} onChange={(e) => { setChapter(e.target.value); setTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" required disabled={!subject}>
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

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Video Title <span className="text-red-500">*</span></label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. Biot-Savart Law — Derivation" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">YouTube Video URL <span className="text-red-500">*</span></label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} type="text" placeholder="https://youtube.com/watch?v=..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Thumbnail (Optional)</label>
              <div className="relative h-[42px] border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-slate-500">Upload Image</span>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setThumbnailFile(files[0]);
                      const newPreviewUrl = URL.createObjectURL(files[0]);
                      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(newPreviewUrl);
                    } else {
                      setThumbnailFile(null);
                      setPreviewUrl(null);
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Video description..." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none resize-y" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Duration (Mins)</label>
              <input value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Difficulty Level</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">JEE Tag (optional)</label>
              <input value={examTag} onChange={(e) => setExamTag(e.target.value)} type="text" placeholder="e.g. JEE" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Order</label>
              <input value={order} onChange={(e) => setOrder(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 mt-2">
            <div>
              <label className="text-sm font-semibold text-slate-800">Active Status</label>
              <p className="text-xs text-slate-500 mt-0.5">Make this video visible to students.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
            <button type="button" onClick={() => { setYoutubeUrl(""); setTitle(""); setSubject(""); setChapter(""); setTopic(""); setExamTag(""); setDescription(""); setDurationMinutes("0"); setOrder("0"); setIsActive(true); setThumbnailFile(null); setPreviewUrl(null); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">
              Clear Form
            </button>
            <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-[#F5A623] text-white font-bold text-sm rounded-lg hover:bg-orange-500 flex items-center gap-2 disabled:opacity-50">
              <Plus size={16} /> {createMutation.isPending ? "Saving..." : "Save Video"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Videos Added</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search videos..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50/50" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center w-[40px]">S.NO.</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">VIDEO</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">SUBJECT</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">CHAPTER</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">DIFFICULTY</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingVideos ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500 text-sm">Loading videos...</td></tr>
              ) : videos.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500 text-sm">No videos found</td></tr>
              ) : (
                videos.map((video: VideoType, index: number) => (
                  <tr key={video._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-4 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 pr-8 flex items-center gap-3">
                      <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><Youtube size={16}/></div>
                      <span className="text-sm font-bold text-slate-700 leading-tight block max-w-sm">{video.title}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2 py-1 rounded text-[9px] font-bold bg-blue-50 text-blue-500">
                        {typeof video.subject === 'object' ? (video.subject as Subject).name : video.subject}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-500">
                      {typeof video.chapter === 'object' ? (video.chapter as Chapter).title : video.chapter}
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn("px-2 py-1 rounded text-[9px] font-bold uppercase", video.difficulty === 'medium' ? "bg-yellow-100 text-yellow-600" : video.difficulty === 'hard' ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500")}>
                        {video.difficulty || "medium"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => {if(confirm("Delete this video?")) deleteMutation.mutate(video._id);}} className="px-3 py-1.5 border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 rounded text-[10px] font-bold transition-colors">Del</button>
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
