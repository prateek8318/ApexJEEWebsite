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
import { Chapter, Subject, Topic } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";

const topicSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  title: z.string().min(1, "Title is required."),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type TopicFormValues = z.infer<typeof topicSchema>;

type TopicDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TopicFormValues) => void;
  isPending: boolean;
  editingTopic?: Topic | null;
};

export default function TopicDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingTopic,
}: TopicDialogProps) {
  
  const [selectedSubject, setSelectedSubject] = useState<string>("");

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

  const subjects: Subject[] = subjectsData?.data || [];
  const chapters: Chapter[] = chaptersData?.data || [];

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema as any),
    defaultValues: {
      subject: "",
      chapter: "",
      title: "",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingTopic) {
      const subjectId = typeof editingTopic.subject === "object" ? (editingTopic.subject as Subject)._id : editingTopic.subject;
      setSelectedSubject(subjectId);
      form.reset({
        subject: subjectId,
        chapter: typeof editingTopic.chapter === "object" ? (editingTopic.chapter as Chapter)._id : editingTopic.chapter,
        title: editingTopic.title,
        order: editingTopic.order || 0,
        isActive: editingTopic.isActive !== false,
      });
    } else {
      setSelectedSubject("");
      form.reset({
        subject: "",
        chapter: "",
        title: "",
        order: 0,
        isActive: true,
      });
    }
  }, [editingTopic, form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingTopic ? "Edit Topic" : "Create Topic"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingTopic
                ? "Update the configuration details for this topic."
                : "Fill in the details below to add a new topic to a chapter."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-10 py-8 space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                        form.setValue("chapter", ""); // Reset chapter when subject changes
                      }} 
                      value={field.value} 
                      disabled={isLoadingSubjects}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.name} ({s.code})
                          </SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingChapters || !selectedSubject}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder={selectedSubject ? "Select a chapter" : "Please select a subject first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chapters.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            Ch {c.chapterNumber}: {c.title}
                          </SelectItem>
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
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Topic Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Biot-Savart Law" 
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
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Display Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm mt-4">
                  <div className="space-y-1.5">
                    <FormLabel className="text-slate-900 font-semibold text-lg">Active Status</FormLabel>
                    <p className="text-base text-slate-500">
                      Make this topic visible to students.
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
                {isPending ? "Saving..." : "Save Topic"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
