"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Subject, Topic, Video, VideoCategory } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { videoCategoriesApi } from "@/lib/api/admin/video-categories";
import { ExternalLink, ImageIcon, Youtube } from "lucide-react";

const videoSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  topic: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  youtubeUrl: z.string().min(1, "YouTube URL is required."),
  noteUrl: z.any().optional(), // file upload
  durationMinutes: z.coerce.number().default(0),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  examTag: z.string().optional(),
  videoCategory: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

type VideoDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: VideoFormValues, thumbnailFile: File | null) => void;
  isPending: boolean;
  editingVideo?: Video | null;
};

export default function VideoDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingVideo,
}: VideoDialogProps) {
  
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => subjectsApi.getAllSubjects(),
    enabled: isOpen,
  });

  const { data: chaptersData, isLoading: isLoadingChapters } = useQuery({
    queryKey: ["admin-chapters-by-subject", selectedSubject],
    queryFn: () => chaptersApi.getAllChapters({ subject: selectedSubject }),
    enabled: isOpen && !!selectedSubject,
  });

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["admin-topics-by-chapter", selectedChapter],
    queryFn: () => topicsApi.getAllTopics({ chapter: selectedChapter }),
    enabled: isOpen && !!selectedChapter,
  });

  const subjects: Subject[] = subjectsData?.data || [];
  const chapters: Chapter[] = chaptersData?.data || [];
  const topics: Topic[] = topicsData?.data || [];

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema as any),
    defaultValues: {
      subject: "",
      chapter: "",
      topic: "",
      title: "",
      description: "",
      youtubeUrl: "",
      durationMinutes: 0,
      difficulty: "medium",
      examTag: "",
      order: 0,
      isActive: true,
    },
  });

  const selectedVideoCategory = form.watch("videoCategory");

  const { data: videoCategoriesData, isLoading: isLoadingVideoCategories } = useQuery({
    queryKey: ["admin-video-categories"],
    queryFn: () => videoCategoriesApi.getAllVideoCategories({ limit: 1000 }),
    enabled: isOpen,
  });

  const videoCategories: VideoCategory[] = videoCategoriesData?.data || [];
  const selectedCategory = videoCategories.find((category) => category._id === selectedVideoCategory);
  const selectedCategoryTopicId = selectedCategory?.topic
    ? typeof selectedCategory.topic === "object"
      ? (selectedCategory.topic as Topic)._id
      : selectedCategory.topic
    : "";

  const { data: categoryTopicData } = useQuery({
    queryKey: ["admin-topic-for-video-category", selectedCategoryTopicId],
    queryFn: () => topicsApi.getTopic(selectedCategoryTopicId),
    enabled: isOpen && !!selectedCategoryTopicId,
  });

  useEffect(() => {
    const categoryTopic = categoryTopicData?.data;
    if (!categoryTopic || !selectedVideoCategory || selectedVideoCategory === "none") return;

    const subjectId = typeof categoryTopic.subject === "object"
      ? (categoryTopic.subject as Subject)._id
      : categoryTopic.subject;
    const chapterId = typeof categoryTopic.chapter === "object"
      ? (categoryTopic.chapter as Chapter)._id
      : categoryTopic.chapter;

    form.setValue("subject", subjectId);
    form.setValue("chapter", chapterId);
    form.setValue("topic", categoryTopic._id);
    setSelectedSubject(subjectId);
    setSelectedChapter(chapterId);
  }, [categoryTopicData, form, selectedVideoCategory]);

  useEffect(() => {
    if (editingVideo) {
      const subjectId = typeof editingVideo.subject === "object" ? (editingVideo.subject as Subject)._id : editingVideo.subject;
      const chapterId = typeof editingVideo.chapter === "object" ? (editingVideo.chapter as Chapter)._id : editingVideo.chapter;
      const category = editingVideo.videoCategory;
      
      setSelectedSubject(subjectId);
      setSelectedChapter(chapterId);
      
      setFileName(
        editingVideo.noteUrl 
          ? "Existing Lecture Note"
          : null
      );

      form.reset({
        subject: subjectId,
        chapter: chapterId,
        topic: editingVideo.topic ? (typeof editingVideo.topic === "object" ? (editingVideo.topic as Topic)._id : editingVideo.topic) : "",
        title: editingVideo.title,
        description: editingVideo.description || "",
        youtubeUrl: editingVideo.youtubeUrl,
        durationMinutes: editingVideo.durationMinutes || 0,
        difficulty: editingVideo.difficulty || "medium",
        examTag: editingVideo.examTag || "",
        videoCategory: category ? (typeof category === "object" ? (category as VideoCategory)._id : category) : "",
        order: editingVideo.order || 0,
        isActive: editingVideo.isActive !== false,
      });
    } else {
      setSelectedSubject("");
      setSelectedChapter("");
      setFileName(null);
      form.reset({
        subject: "",
        chapter: "",
        topic: "",
        title: "",
        description: "",
        youtubeUrl: "",
        durationMinutes: 0,
        difficulty: "medium",
        examTag: "",
        videoCategory: "",
        order: 0,
        isActive: true,
      });
    }
  }, [editingVideo, form, isOpen]);

  const handleFormSubmit = (values: VideoFormValues) => {
    const file = form.getValues("noteUrl");
    onSubmit(values, file instanceof FileList && file.length > 0 ? file[0] : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingVideo ? "Edit Video Lecture" : "Add Video Lecture"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingVideo
                ? "Make changes to the video details here."
                : "Fill in the details below to add a new video lecture to a topic."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="px-10 py-8 space-y-8">
            <FormField
              control={form.control}
              name="videoCategory"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Video Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoadingVideoCategories}>
                    <FormControl>
                      <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                        <SelectValue placeholder="Select category first to auto-fill topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">-- None --</SelectItem>
                      {videoCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}{category.topic && typeof category.topic === "object" ? ` - ${(category.topic as Topic).title}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Subject <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedSubject(val);
                        form.setValue("chapter", "");
                        setSelectedChapter("");
                        form.setValue("topic", "");
                        form.setValue("videoCategory", "");
                      }} 
                      value={field.value} 
                      disabled={isLoadingSubjects}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chapter"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Chapter <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedChapter(val);
                        form.setValue("topic", "");
                        form.setValue("videoCategory", "");
                      }} 
                      value={field.value} 
                      disabled={isLoadingChapters || !selectedSubject}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder={selectedSubject ? "Select chapter" : "Wait..."} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chapters.map((c) => (
                          <SelectItem key={c._id} value={c._id}>Ch {c.chapterNumber}: {c.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Topic (Optional)</FormLabel>
                    <Select onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("videoCategory", "");
                    }} value={field.value || ""} disabled={isLoadingTopics || !selectedChapter}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">-- None --</SelectItem>
                        {topics.map((t) => (
                          <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
              )}
            />
          </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Video Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Introduction to Magnetism" 
                      className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">YouTube URL / Video ID <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          placeholder="e.g. dQw4w9WgXcQ" 
                          className="h-12 pl-12 pr-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noteUrl"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Lecture Note (PDF)</FormLabel>
                    <FormControl>
                      <div className="relative group mt-2 h-16">
                        <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden transition-colors group-hover:border-slate-300 group-hover:bg-slate-100">
                          {fileName ? (
                            <div className="text-sm font-semibold text-blue-600 px-4 truncate">{fileName}</div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-500">
                              <ImageIcon className="w-5 h-5" />
                              <span className="text-sm font-semibold">Upload PDF/Doc</span>
                            </div>
                          )}
                        </div>
                        <Input
                          type={"file" as any}
                          accept=".pdf,.doc,.docx"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            const files = e.target.files;
                            onChange(files);
                            if (files && files.length > 0) {
                              setFileName(files[0].name);
                            }
                          }}
                          {...field}
                        />
                      </div>
                      {editingVideo?.noteUrl && (
                        <a href={editingVideo.noteUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                          <ExternalLink className="h-3.5 w-3.5" /> View existing note
                        </a>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Video description..." 
                      className="min-h-[100px] px-4 py-3 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2 resize-y" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Duration (Mins)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="examTag"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Exam Tag</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. JEE" 
                        className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm mt-4">
                  <div className="space-y-1.5">
                    <FormLabel className="text-slate-900 font-semibold text-lg">Active Status</FormLabel>
                    <p className="text-base text-slate-500">
                      Make this video visible to students.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600 scale-125"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="h-12 px-6 font-semibold border-slate-200 hover:bg-slate-50 text-slate-600 text-base"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="h-12 px-8 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-base"
              >
                {isPending ? "Saving..." : "Save Video"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
