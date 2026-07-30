"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { Subject, Chapter, Topic } from "@/types/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download } from "lucide-react";

const bulkUploadSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  chapter: z.string().min(1, "Chapter is required"),
  topic: z.string().min(1, "Topic is required"),
});

type BulkUploadFormValues = z.infer<typeof bulkUploadSchema>;

interface BulkUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BulkUploadFormValues, file: File) => void;
  isPending: boolean;
}

export default function BulkUploadDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
}: BulkUploadDialogProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<BulkUploadFormValues>({
    resolver: zodResolver(bulkUploadSchema),
    defaultValues: {
      subject: "",
      chapter: "",
      topic: "",
    },
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["admin-subjects-list"],
    queryFn: () => subjectsApi.getAllSubjects(),
    enabled: isOpen,
  });

  const { data: chaptersData, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["admin-chapters-by-subject", selectedSubject],
    queryFn: () => chaptersApi.getAllChapters({ subject: selectedSubject }),
    enabled: isOpen && !!selectedSubject,
  });

  const { data: topicsData, isLoading: isTopicsLoading } = useQuery({
    queryKey: ["admin-topics-by-chapter", selectedChapter],
    queryFn: () => topicsApi.getAllTopics({ chapter: selectedChapter }),
    enabled: isOpen && !!selectedChapter,
  });

  const subjects: Subject[] = subjectsData?.data || [];
  const chapters: Chapter[] = chaptersData?.data || [];
  const topics: Topic[] = topicsData?.data || [];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setFile(null);
      setSelectedSubject("");
      setSelectedChapter("");
    }
    onOpenChange(open);
  };

  const handleSubmit = (values: BulkUploadFormValues) => {
    if (!file) return;
    onSubmit(values, file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Questions</DialogTitle>
          <DialogDescription>
            Upload a Word document (.docx) to bulk import questions into a specific topic.
          </DialogDescription>
          <div className="mt-2">
            <a href="/templates/bulk_upload_questions.docx" download>
              <Button variant="outline" size="sm" type="button" className="h-8">
                <Download className="mr-2 size-3" /> Download Template
              </Button>
            </a>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}
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
                  <FormLabel>Chapter *</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedChapter(val);
                      form.setValue("topic", "");
                    }}
                    value={field.value}
                    disabled={!selectedSubject || isChaptersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chapter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chapters.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.title}
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
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedChapter || isTopicsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {topics.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Word Document (.docx) *</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </FormControl>
            </FormItem>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !file}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
