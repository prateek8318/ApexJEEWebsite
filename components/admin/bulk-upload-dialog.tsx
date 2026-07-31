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
import { Loader2, Download, FileUp, UploadCloud } from "lucide-react";

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
    resolver: zodResolver(bulkUploadSchema as any),
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
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl text-slate-800 flex items-center gap-2">
            <FileUp className="h-5 w-5 text-violet-600" />
            Bulk Upload Questions
          </DialogTitle>
          <DialogDescription className="text-slate-500 pt-1">
            Upload a Word document (.docx) to bulk import questions into a specific topic. Make sure to follow the template format.
          </DialogDescription>
          <div className="mt-3">
            <a href="/templates/bulk_upload_questions.docx" download>
              <Button variant="outline" size="sm" type="button" className="h-8 border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800">
                <Download className="mr-2 size-3" /> Download Template
              </Button>
            </a>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
            <div className="px-6 py-5 space-y-5">
            
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
              <FormLabel className="text-slate-700 font-semibold">Word Document (.docx) *</FormLabel>
              <FormControl>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-1 text-sm text-slate-600 font-medium">
                        {file ? file.name : <><span className="font-semibold text-violet-600">Click to upload</span> or drag and drop</>}
                      </p>
                      <p className="text-xs text-slate-500">.docx Word Document only</p>
                    </div>
                    <Input
                      type={"file" as any}
                      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                      className="hidden"
                    />
                  </label>
                </div>
              </FormControl>
            </FormItem>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !file} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Questions
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
