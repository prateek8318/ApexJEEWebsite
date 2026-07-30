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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Subject, Topic, Video } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";

const videoSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  topic: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  youtubeUrl: z.string().min(1, "YouTube URL is required."),
  thumbnailUrl: z.any().optional(), // file upload
  durationMinutes: z.coerce.number().default(0),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  examTag: z.string().optional(),
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

  const { data: subjectsData } = useQuery({
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
    resolver: zodResolver(videoSchema),
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

  useEffect(() => {
    if (editingVideo) {
      const subjectId = typeof editingVideo.subject === "object" ? (editingVideo.subject as Subject)._id : editingVideo.subject;
      const chapterId = typeof editingVideo.chapter === "object" ? (editingVideo.chapter as Chapter)._id : editingVideo.chapter;
      
      setSelectedSubject(subjectId);
      setSelectedChapter(chapterId);

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
        order: editingVideo.order || 0,
        isActive: editingVideo.isActive !== false,
      });
    } else {
      setSelectedSubject("");
      setSelectedChapter("");
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
        order: 0,
        isActive: true,
      });
    }
  }, [editingVideo, form, isOpen]);

  const handleFormSubmit = (values: VideoFormValues) => {
    const file = form.getValues("thumbnailUrl");
    onSubmit(values, file instanceof FileList && file.length > 0 ? file[0] : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingVideo ? "Edit Video" : "Add Video"}</DialogTitle>
          <DialogDescription>
            {editingVideo
              ? "Make changes to the video lecture details here."
              : "Fill in the details to add a new video lecture."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedSubject(val);
                        form.setValue("chapter", "");
                        setSelectedChapter("");
                        form.setValue("topic", "");
                      }} 
                      value={field.value} 
                    >
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
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
                  <FormItem>
                    <FormLabel>Chapter <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedChapter(val);
                        form.setValue("topic", "");
                      }} 
                      value={field.value} 
                      disabled={!selectedSubject}
                    >
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder={selectedSubject ? "Select chapter" : "Wait..."} /></SelectTrigger>
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
                  <FormItem>
                    <FormLabel>Topic (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedChapter}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
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
                <FormItem>
                  <FormLabel>Video Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="e.g. Introduction to Magnetism" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube ID / URL <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="e.g. dQw4w9WgXcQ" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Thumbnail (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
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
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Video description..." className="min-h-[80px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Mins)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                  <FormItem>
                    <FormLabel>Exam Tag</FormLabel>
                    <FormControl><Input placeholder="e.g. JEE" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>Active (Visible to students)</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Video"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
