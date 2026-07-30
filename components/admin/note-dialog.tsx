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
import { Chapter, Subject, Topic, Note } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";

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

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingNote ? "Edit Note" : "Add Note / Document"}</DialogTitle>
          <DialogDescription>
            {editingNote
              ? "Make changes to the document details here."
              : "Upload a PDF and fill in the details."}
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
                      <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
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
                      <FormControl><SelectTrigger><SelectValue placeholder={selectedSubject ? "Select chapter" : "Wait..."} /></SelectTrigger></FormControl>
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
                      <FormControl><SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger></FormControl>
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
                  <FormLabel>Note Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="e.g. Detailed Notes on Magnetism" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                  <FormItem>
                    <FormLabel>PDF File (Optional for edit)</FormLabel>
                    <FormControl>
                      <Input type="file" accept="application/pdf" onChange={(e) => onChange(e.target.files)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Pages</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md mt-4 bg-muted/30">
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1">
                      <FormLabel>Premium Note</FormLabel>
                      <p className="text-xs text-muted-foreground">Require paid subscription to access</p>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1">
                      <FormLabel>Active Status</FormLabel>
                      <p className="text-xs text-muted-foreground">Visible to students</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Note"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
