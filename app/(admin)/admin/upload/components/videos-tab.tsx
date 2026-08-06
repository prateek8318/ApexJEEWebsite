"use client";

import React, { useEffect, useState } from "react";
import { Edit, ExternalLink, Eye, FileText, Plus, Search, Trash2, Video, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { videosApi } from "@/lib/api/admin/videos";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { videoCategoriesApi } from "@/lib/api/admin/video-categories";
import { toast } from "sonner";
import { Video as VideoType, Subject, Chapter, Topic, VideoCategory } from "@/types/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VideosTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Form States
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("0");
  const [difficulty, setDifficulty] = useState("medium");
  const [examTag, setExamTag] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [viewVideo, setViewVideo] = useState<VideoType | null>(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categorySubject, setCategorySubject] = useState("");
  const [categoryChapter, setCategoryChapter] = useState("");
  const [categoryTopic, setCategoryTopic] = useState("");
  const [categoryOrder, setCategoryOrder] = useState("0");
  const [editingCategory, setEditingCategory] = useState<VideoCategory | null>(null);

  const queryClient = useQueryClient();

  const { data: videosData, isLoading: isLoadingVideos } = useQuery({
    queryKey: ["admin-videos", search, page, limit],
    queryFn: () => videosApi.getAllVideos({ search, page, limit }),
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => subjectsApi.getAllSubjects({}),
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

  const { data: categoryChaptersData } = useQuery({
    queryKey: ["admin-category-chapters-by-subject", categorySubject],
    queryFn: () => chaptersApi.getAllChapters({ subject: categorySubject }),
    enabled: !!categorySubject,
  });

  const { data: categoryTopicsData } = useQuery({
    queryKey: ["admin-category-topics-by-chapter", categoryChapter],
    queryFn: () => topicsApi.getAllTopics({ chapter: categoryChapter }),
    enabled: !!categoryChapter,
  });

  const { data: allVideoCategoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["admin-video-categories-all"],
    queryFn: () => videoCategoriesApi.getAllVideoCategories({ limit: 1000 }),
  });

  const videos = videosData?.data || [];
  const subjects = subjectsData?.data || [];
  const chapters = chaptersData?.data || [];
  const topicsList = topicsData?.data || [];
  const categoryChapters = categoryChaptersData?.data || [];
  const categoryTopics = categoryTopicsData?.data || [];
  const allVideoCategories = allVideoCategoriesData?.data || [];

  const selectedCategory = allVideoCategories.find((category: VideoCategory) => category._id === videoCategory);
  const selectedCategoryTopicId = selectedCategory?.topic
    ? typeof selectedCategory.topic === "object"
      ? (selectedCategory.topic as Topic)._id
      : selectedCategory.topic
    : "";

  const { data: selectedCategoryTopicData } = useQuery({
    queryKey: ["admin-topic-for-selected-video-category", selectedCategoryTopicId],
    queryFn: () => topicsApi.getTopic(selectedCategoryTopicId),
    enabled: !!selectedCategoryTopicId,
  });

  const editingCategoryTopicId = editingCategory?.topic
    ? typeof editingCategory.topic === "object"
      ? (editingCategory.topic as Topic)._id
      : editingCategory.topic
    : "";

  const { data: editingCategoryTopicData } = useQuery({
    queryKey: ["admin-topic-for-editing-video-category", editingCategoryTopicId],
    queryFn: () => topicsApi.getTopic(editingCategoryTopicId),
    enabled: !!editingCategoryTopicId,
  });

  const resetVideoForm = () => {
    setYoutubeUrl("");
    setTitle("");
    setSubject("");
    setChapter("");
    setTopic("");
    setVideoCategory("");
    setExamTag("");
    setDescription("");
    setDurationMinutes("0");
    setDifficulty("medium");
    setOrder("0");
    setIsActive(true);
    setNoteFile(null);
    setEditingVideo(null);
    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const resetCategoryForm = () => {
    setCategoryTitle("");
    setCategorySubject("");
    setCategoryChapter("");
    setCategoryTopic("");
    setCategoryOrder("0");
    setEditingCategory(null);
  };

  useEffect(() => {
    const categoryTopicData = selectedCategoryTopicData?.data;
    if (!categoryTopicData || !videoCategory) return;

    const subjectId = typeof categoryTopicData.subject === "object"
      ? (categoryTopicData.subject as Subject)._id
      : categoryTopicData.subject;
    const chapterId = typeof categoryTopicData.chapter === "object"
      ? (categoryTopicData.chapter as Chapter)._id
      : categoryTopicData.chapter;

    setSubject(subjectId);
    setChapter(chapterId);
    setTopic(categoryTopicData._id);
  }, [selectedCategoryTopicData, videoCategory]);

  useEffect(() => {
    const topicData = editingCategoryTopicData?.data;
    if (!topicData || !editingCategory) return;

    const subjectId = typeof topicData.subject === "object"
      ? (topicData.subject as Subject)._id
      : topicData.subject;
    const chapterId = typeof topicData.chapter === "object"
      ? (topicData.chapter as Chapter)._id
      : topicData.chapter;

    setCategorySubject(subjectId);
    setCategoryChapter(chapterId);
    setCategoryTopic(topicData._id);
  }, [editingCategory, editingCategoryTopicData]);

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => videosApi.createVideo(formData),
    onSuccess: () => {
      toast.success("Video created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      resetVideoForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create video");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => videosApi.updateVideo(id, formData),
    onSuccess: () => {
      toast.success("Video updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      resetVideoForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update video");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => videosApi.deleteVideo(id),
    onSuccess: () => {
      toast.success("Video deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
  });

  const saveCategoryMutation = useMutation({
    mutationFn: (payload: { id?: string; data: Partial<VideoCategory> }) =>
      payload.id
        ? videoCategoriesApi.updateVideoCategory(payload.id, payload.data)
        : videoCategoriesApi.createVideoCategory(payload.data),
    onSuccess: () => {
      toast.success(editingCategory ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["admin-video-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-video-categories-all"] });
      resetCategoryForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => videoCategoriesApi.deleteVideoCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-video-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-video-categories-all"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete category");
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
    if (videoCategory) formData.append("videoCategory", videoCategory);
    if (description) formData.append("description", description);
    formData.append("difficulty", difficulty);
    formData.append("durationMinutes", durationMinutes);
    if (examTag) formData.append("examTag", examTag);
    formData.append("order", order);
    formData.append("isActive", String(isActive));
    if (noteFile) formData.append("noteUrl", noteFile);

    if (editingVideo) {
      updateMutation.mutate({ id: editingVideo._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEditVideo = (video: VideoType) => {
    const subjectId = typeof video.subject === "object" ? (video.subject as Subject)._id : video.subject;
    const chapterId = typeof video.chapter === "object" ? (video.chapter as Chapter)._id : video.chapter;
    const topicId = video.topic ? (typeof video.topic === "object" ? (video.topic as Topic)._id : video.topic) : "";
    const categoryId = video.videoCategory ? (typeof video.videoCategory === "object" ? (video.videoCategory as VideoCategory)._id : video.videoCategory) : "";

    setEditingVideo(video);
    setSubject(subjectId);
    setChapter(chapterId);
    setTopic(topicId);
    setVideoCategory(categoryId);
    setTitle(video.title);
    setYoutubeUrl(video.youtubeUrl);
    setDescription(video.description || "");
    setDurationMinutes(String(video.durationMinutes || 0));
    setDifficulty(video.difficulty || "medium");
    setExamTag(video.examTag || "");
    setOrder(String(video.order || 0));
    setIsActive(video.isActive !== false);
    setNoteFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryTitle.trim()) {
      toast.error("Category title is required");
      return;
    }

    saveCategoryMutation.mutate({
      id: editingCategory?._id,
      data: {
        title: categoryTitle.trim(),
        topic: categoryTopic || undefined,
        order: Number(categoryOrder) || 0,
      },
    });
  };

  const handleEditCategory = (category: VideoCategory) => {
    setEditingCategory(category);
    setCategoryTitle(category.title);
    setCategorySubject("");
    setCategoryChapter("");
    setCategoryTopic(category.topic ? (typeof category.topic === "object" ? (category.topic as Topic)._id : category.topic) : "");
    setCategoryOrder(String(category.order || 0));
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
            <Video size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">{editingVideo ? "Edit Video Lecture" : "Add Video Lecture"}</h2>
        </div>

        <form onSubmit={handleAddVideo} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Video Category</label>
            <select value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" disabled={isLoadingCategories}>
              <option value="">Select category first to auto-fill topic</option>
              {allVideoCategories.map((category: VideoCategory) => (
                <option key={category._id} value={category._id}>
                  {category.title}{category.topic && typeof category.topic === "object" ? ` - ${(category.topic as Topic).title}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Subject <span className="text-red-500">*</span></label>
              <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(""); setTopic(""); setVideoCategory(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" required>
                <option value="">Select subject</option>
                {subjects.map((s: Subject) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Chapter <span className="text-red-500">*</span></label>
              <select value={chapter} onChange={(e) => { setChapter(e.target.value); setTopic(""); setVideoCategory(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" required disabled={!subject}>
                <option value="">Select chapter</option>
                {chapters.map((c: Chapter) => (
                  <option key={c._id} value={c._id}>Ch {c.chapterNumber}: {c.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Topic</label>
              <select value={topic} onChange={(e) => { setTopic(e.target.value); setVideoCategory(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" disabled={isLoadingTopics || !chapter}>
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
              <label className="text-[11px] font-bold text-slate-600">Lecture Note (PDF)</label>
              <div className="relative group h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-colors hover:border-slate-300 hover:bg-slate-100 cursor-pointer">
                {noteFile ? (
                  <div className="text-sm font-semibold text-blue-600 px-4 truncate">{noteFile.name}</div>
                ) : editingVideo?.noteUrl ? (
                  <div className="flex flex-col items-center gap-1 text-blue-600">
                    <FileText size={20} />
                    <span className="text-xs font-semibold">Existing note attached</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <Video size={20} />
                    <span className="text-xs font-semibold">Upload PDF/Doc</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNoteFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              {editingVideo?.noteUrl && (
                <a href={editingVideo.noteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  <ExternalLink size={13} /> View existing note
                </a>
              )}
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
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
            <button type="button" onClick={resetVideoForm} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">
              {editingVideo ? "Cancel Edit" : "Clear Form"}
            </button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2.5 bg-[#F5A623] text-white font-bold text-sm rounded-lg hover:bg-orange-500 flex items-center gap-2 disabled:opacity-50">
              <Plus size={16} /> {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingVideo ? "Update Video" : "Save Video"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Video size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Video Categories</h2>
        </div>

        <form onSubmit={handleSaveCategory} className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_1fr_120px_auto] gap-4 items-end mb-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Title <span className="text-red-500">*</span></label>
            <input value={categoryTitle} onChange={(e) => setCategoryTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" placeholder="e.g. Derivation" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Subject</label>
            <select value={categorySubject} onChange={(e) => { setCategorySubject(e.target.value); setCategoryChapter(""); setCategoryTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
              <option value="">Select subject</option>
              {subjects.map((item: Subject) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Chapter</label>
            <select value={categoryChapter} onChange={(e) => { setCategoryChapter(e.target.value); setCategoryTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" disabled={!categorySubject}>
              <option value="">Select chapter</option>
              {categoryChapters.map((item: Chapter) => (
                <option key={item._id} value={item._id}>Ch {item.chapterNumber}: {item.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Topic</label>
            <select value={categoryTopic} onChange={(e) => setCategoryTopic(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" disabled={!categoryChapter}>
              <option value="">No topic</option>
              {categoryTopics.map((item: Topic) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Order</label>
            <input value={categoryOrder} onChange={(e) => setCategoryOrder(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
          </div>
          <div className="flex gap-2">
            {editingCategory && (
              <button type="button" onClick={resetCategoryForm} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">Cancel</button>
            )}
            <button type="submit" disabled={saveCategoryMutation.isPending} className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saveCategoryMutation.isPending ? "Saving..." : editingCategory ? "Update" : "Create"}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center w-10">S.NO.</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">CATEGORY</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOPIC</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ORDER</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {allVideoCategories.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-sm">No categories found</td></tr>
              ) : (
                allVideoCategories.map((category: VideoCategory, index: number) => (
                  <tr key={category._id} className="border-b border-slate-100 hover:bg-slate-50/70">
                    <td className="py-4 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 text-sm font-semibold text-slate-700">{category.title}</td>
                    <td className="py-4 text-xs font-medium text-slate-500">
                      {category.topic ? (typeof category.topic === "object" ? (category.topic as Topic).title : category.topic) : "No topic"}
                    </td>
                    <td className="py-4 text-center text-xs font-bold text-slate-500">{category.order || 0}</td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button type="button" onClick={() => handleEditCategory(category)} className="p-2 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"><Edit size={14} /></button>
                        <button type="button" onClick={() => { if (confirm("Delete this category?")) deleteCategoryMutation.mutate(category._id); }} className="p-2 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Videos Added</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} type="text" placeholder="Search videos..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50/50" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center w-10">S.NO.</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">TITLE</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">SUBJECT</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">CHAPTER</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">CATEGORY</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">DIFFICULTY</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">LINKS</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingVideos ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-500 text-sm">Loading videos...</td></tr>
              ) : videos.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-500 text-sm">No videos found</td></tr>
              ) : (
                videos.map((video: VideoType, index: number) => (
                  <tr key={video._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-4 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 pr-8">
                      <div className="text-sm font-bold text-slate-700">{video.title}</div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-[10px] font-semibold text-rose-600"><Youtube size={12} /> YouTube</span>
                        {video.noteUrl ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">Notes</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2 py-1 rounded text-[9px] font-bold bg-blue-50 text-blue-500">
                        {typeof video.subject === 'object' ? (video.subject as Subject).name : video.subject}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-500">
                      {typeof video.chapter === 'object' ? (video.chapter as Chapter).title : video.chapter}
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-500">
                      {video.videoCategory ? (typeof video.videoCategory === "object" ? (video.videoCategory as VideoCategory).title : video.videoCategory) : "-"}
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn("px-2 py-1 rounded text-[9px] font-bold uppercase", video.difficulty === 'medium' ? "bg-yellow-100 text-yellow-600" : video.difficulty === 'hard' ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500")}>
                        {video.difficulty || "medium"}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-slate-700">
                      <div className="flex flex-col gap-1">
                        <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="font-semibold text-rose-600 hover:underline">Open YouTube</a>
                        {video.noteUrl ? (
                          <a href={video.noteUrl} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:underline">Open Notes</a>
                        ) : (
                          <span className="text-slate-400">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewVideo(video)} className="p-2 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"><Eye size={14} /></button>
                        <button onClick={() => handleEditVideo(video)} className="p-2 rounded text-slate-500 hover:text-orange-600 hover:bg-orange-50"><Edit size={14} /></button>
                        <button onClick={() => {if(confirm("Delete this video?")) deleteMutation.mutate(video._id);}} className="p-2 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs border border-slate-200 rounded px-2 py-1 outline-none bg-white text-slate-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <span className="text-xs text-slate-500">
            Showing {videos.length} of {videosData?.totalResult  || 0} videos
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-slate-700">
              Page {page} of {videosData?.totalPage  || 1}
            </span>
            <button 
              disabled={page === (videosData?.totalPage  || 1)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Dialog open={!!viewVideo} onOpenChange={(open) => !open && setViewVideo(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{viewVideo?.title}</DialogTitle>
          </DialogHeader>
          {viewVideo && (
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Subject:</span> {typeof viewVideo.subject === "object" ? (viewVideo.subject as Subject).name : viewVideo.subject}</p>
              <p><span className="font-semibold text-slate-800">Chapter:</span> {typeof viewVideo.chapter === "object" ? (viewVideo.chapter as Chapter).title : viewVideo.chapter}</p>
              <p><span className="font-semibold text-slate-800">Category:</span> {viewVideo.videoCategory ? (typeof viewVideo.videoCategory === "object" ? (viewVideo.videoCategory as VideoCategory).title : viewVideo.videoCategory) : "-"}</p>
              <p><span className="font-semibold text-slate-800">Difficulty:</span> {viewVideo.difficulty || "medium"}</p>
              <p><span className="font-semibold text-slate-800">Duration:</span> {viewVideo.durationMinutes || 0} mins</p>
              {viewVideo.description && <p><span className="font-semibold text-slate-800">Description:</span> {viewVideo.description}</p>}
              <div className="flex flex-wrap gap-3">
                <a href={viewVideo.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex text-blue-600 font-semibold hover:underline">Open YouTube video</a>
                {viewVideo.noteUrl && (
                  <a href={viewVideo.noteUrl} target="_blank" rel="noreferrer" className="inline-flex text-blue-600 font-semibold hover:underline">Open lecture note</a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
