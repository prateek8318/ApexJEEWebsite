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
    resolver: zodResolver(topicSchema),
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTopic ? "Edit Topic" : "Add Topic"}</DialogTitle>
          <DialogDescription>
            {editingTopic
              ? "Make changes to the topic details here."
              : "Fill in the details to create a new topic."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
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
                      form.setValue("chapter", ""); // Reset chapter when subject changes
                    }} 
                    value={field.value} 
                    disabled={isLoadingSubjects}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel>Chapter <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingChapters || !selectedSubject}>
                    <FormControl>
                      <SelectTrigger>
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

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Biot-Savart Law" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Is this topic visible?
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Topic"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
