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
import { Switch } from "@/components/ui/switch";
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
    resolver: zodResolver(chapterSchema as any),
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
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingChapter ? "Edit Chapter" : "Create Chapter"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingChapter
                ? "Update the configuration details for this chapter."
                : "Fill in the details below to add a new chapter to a subject."}
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingSubjects}>
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
                name="difficulty"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="unitName"
                render={({ field }) => (
                  <FormItem className="space-y-2.5 col-span-2">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Unit Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. UNIT III — MAGNETIC EFFECTS" 
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
                name="unitOrder"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Unit Order</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <FormField
                control={form.control}
                name="chapterNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Ch. No. <span className="text-destructive">*</span></FormLabel>
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
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2.5 col-span-3">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Chapter Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Magnetic Effects of Current" 
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
              name="subtitle"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Biot-Savart • Ampere's Law" 
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
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed description..." 
                      className="min-h-[120px] px-4 py-3 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2 resize-y" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Tags (Comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. jee, neet, class12" 
                      className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="examWeightagePercent"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Exam Weightage (%)</FormLabel>
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm mt-4">
                  <div className="space-y-1.5">
                    <FormLabel className="text-slate-900 font-semibold text-lg">Active Status</FormLabel>
                    <p className="text-base text-slate-500">
                      Make this chapter visible to students.
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
                {isPending ? "Saving..." : "Save Chapter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
