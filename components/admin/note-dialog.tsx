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
import { Chapter, Subject, Topic, Note } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { FileText, CheckCircle2 } from "lucide-react";

const noteSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  topic: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  type: z.enum(["notes", "formula", "solved_example"]).default("notes"),
  fileUrl: z.any().optional(), // For file upload
  pageCount: z.coerce.number().default(0),
  isPremium: z.boolean().default(false),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

type NoteDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NoteFormValues, pdfFile: File | null) => void;
  isPending: boolean;
  editingNote?: Note | null;
};

export default function NoteDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingNote,
}: NoteDialogProps) {
  
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

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema as any),
    defaultValues: {
      subject: "",
      chapter: "",
      topic: "",
      title: "",
      type: "notes",
      pageCount: 0,
      isPremium: false,
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingNote) {
      const subjectId = typeof editingNote.subject === "object" ? (editingNote.subject as Subject)._id : editingNote.subject;
      const chapterId = typeof editingNote.chapter === "object" ? (editingNote.chapter as Chapter)._id : editingNote.chapter;
      
      setSelectedSubject(subjectId);
      setSelectedChapter(chapterId);
      setFileName(null);

      form.reset({
        subject: subjectId,
        chapter: chapterId,
        topic: editingNote.topic ? (typeof editingNote.topic === "object" ? (editingNote.topic as Topic)._id : editingNote.topic) : "",
        title: editingNote.title,
        type: editingNote.type || "notes",
        pageCount: editingNote.pageCount || 0,
        isPremium: editingNote.isPremium || false,
        order: editingNote.order || 0,
        isActive: editingNote.isActive !== false,
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
        type: "notes",
        pageCount: 0,
        isPremium: false,
        order: 0,
        isActive: true,
      });
    }
  }, [editingNote, form, isOpen]);

  const handleFormSubmit = (values: NoteFormValues) => {
    const file = form.getValues("fileUrl");
    onSubmit(values, file instanceof FileList && file.length > 0 ? file[0] : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingNote ? "Edit Note" : "Create Note / Document"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingNote
                ? "Make changes to the document details here."
                : "Upload a PDF and fill in the details below to add a new document."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="px-10 py-8 space-y-8">
            
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
                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoadingTopics || !selectedChapter}>
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
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Note Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Detailed Notes on Magnetism" 
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
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Document Type <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="formula">Formula Sheet</SelectItem>
                        <SelectItem value="solved_example">Solved Examples</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">PDF Document</FormLabel>
                    <FormControl>
                      <div className="relative group mt-2">
                        <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${fileName ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}>
                          {fileName ? (
                            <div className="flex flex-col items-center gap-2 py-1">
                              <CheckCircle2 className="w-8 h-8 text-blue-500" />
                              <span className="text-sm font-semibold text-slate-800 line-clamp-1">{fileName}</span>
                              <span className="text-xs text-blue-600 font-medium">Click to replace PDF</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-2">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                                <FileText className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-semibold text-slate-700">Upload PDF File</p>
                              <p className="text-xs text-slate-500 mt-1">(Max 10MB)</p>
                            </div>
                          )}
                        </div>
                        <Input
                          type={"file" as any}
                          accept="application/pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                    </FormControl>
                    <div className="text-sm mt-2">
                      {editingNote?.fileUrl && !fileName && (
                        <span className="text-emerald-600 font-medium">✓ Current PDF is active. </span>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="pageCount"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Total Pages</FormLabel>
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
                name="order"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Display Order</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm mt-4">
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Premium Content</FormLabel>
                      <p className="text-sm text-slate-500">
                        Require paid subscription to access this note.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 scale-110"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between pl-0 md:pl-6 md:border-l border-slate-200">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Active Status</FormLabel>
                      <p className="text-sm text-slate-500">
                        Make this document visible to students.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 scale-110"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                {isPending ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
