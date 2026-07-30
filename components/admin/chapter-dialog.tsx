"use client";

import { useEffect } from "react";
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
import { Chapter, Subject } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { Textarea } from "@/components/ui/textarea";

const chapterSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  unitName: z.string().min(1, "Unit name is required."),
  unitOrder: z.coerce.number().default(0),
  chapterNumber: z.coerce.number().min(1, "Chapter number is required."),
  title: z.string().min(1, "Title is required."),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  examWeightagePercent: z.coerce.number().default(0),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type ChapterFormValues = z.infer<typeof chapterSchema>;

type ChapterDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ChapterFormValues) => void;
  isPending: boolean;
  editingChapter?: Chapter | null;
};

export default function ChapterDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingChapter,
}: ChapterDialogProps) {
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => subjectsApi.getAllSubjects(),
    enabled: isOpen,
  });

  const subjects: Subject[] = subjectsData?.data || [];

  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      subject: "",
      unitName: "",
      unitOrder: 0,
      chapterNumber: 1,
      title: "",
      subtitle: "",
      description: "",
      tags: "",
      examWeightagePercent: 0,
      difficulty: "medium",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingChapter) {
      form.reset({
        subject: typeof editingChapter.subject === "object" ? (editingChapter.subject as Subject)._id : editingChapter.subject,
        unitName: editingChapter.unitName,
        unitOrder: editingChapter.unitOrder || 0,
        chapterNumber: editingChapter.chapterNumber,
        title: editingChapter.title,
        subtitle: editingChapter.subtitle || "",
        description: editingChapter.description || "",
        tags: editingChapter.tags ? editingChapter.tags.join(", ") : "",
        examWeightagePercent: editingChapter.examWeightagePercent || 0,
        difficulty: editingChapter.difficulty || "medium",
        order: editingChapter.order || 0,
        isActive: editingChapter.isActive !== false,
      });
    } else {
      form.reset({
        subject: "",
        unitName: "",
        unitOrder: 0,
        chapterNumber: 1,
        title: "",
        subtitle: "",
        description: "",
        tags: "",
        examWeightagePercent: 0,
        difficulty: "medium",
        order: 0,
        isActive: true,
      });
    }
  }, [editingChapter, form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingChapter ? "Edit Chapter" : "Add Chapter"}</DialogTitle>
          <DialogDescription>
            {editingChapter
              ? "Make changes to the chapter details here."
              : "Fill in the details to create a new chapter."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingSubjects}>
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
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="unitName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Unit Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. UNIT III — MAGNETIC EFFECTS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="chapterNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ch. No. <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Chapter Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Magnetic Effects of Current" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Biot-Savart • Ampere's Law" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. jee, neet, class12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="examWeightagePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Weightage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
            </div>

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
                      Is this chapter visible to students?
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
                {isPending ? "Saving..." : "Save Chapter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
