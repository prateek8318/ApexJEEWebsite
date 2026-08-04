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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Test } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { topicsApi } from "@/lib/api/admin/topics";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";

const testSchema = z.object({
  title: z.string().min(1, "Title is required."),
  examTag: z.string().optional(),
  mode: z.string().optional(),
  testCategory: z.string().optional(),
  subject: z.string().optional(),
  chapter: z.string().optional(),
  topic: z.string().optional(),
  instructions: z.any().optional(),
  negativeMarking: z.boolean().default(false),
  durationMins: z.coerce.number().default(180),
  scheduledAt: z.string().optional(),
  isLive: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type TestFormValues = z.infer<typeof testSchema>;

type TestDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TestFormValues) => void;
  isPending: boolean;
  editingTest?: Test | null;
  defaultMode?: "practice" | "mock";
};

export default function TestDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingTest,
  defaultMode,
}: TestDialogProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  
  const [instructionsList, setInstructionsList] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState("");
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema as any),
    defaultValues: {
      title: "",
      examTag: "",
      mode: defaultMode || "",
      testCategory: "topic",
      subject: "",
      chapter: "",
      topic: "",
      instructions: "",
      negativeMarking: false,
      durationMins: 180,
      scheduledAt: "",
      isLive: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingTest) {
      let parsed = [];
      if (typeof editingTest.instructions === "string") {
        try {
          parsed = JSON.parse(editingTest.instructions);
        } catch {
          // fallback if it's just a raw string
          parsed = [editingTest.instructions];
        }
      } else if (Array.isArray(editingTest.instructions)) {
        parsed = editingTest.instructions;
      }
      setInstructionsList(parsed || []);

      let scheduledAtFormatted = "";
      if (editingTest.scheduledAt) {
        const date = new Date(editingTest.scheduledAt);
        // Format to YYYY-MM-DDThh:mm
        const pad = (num: number) => num.toString().padStart(2, '0');
        scheduledAtFormatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      }

      form.reset({
        title: editingTest.title,
        examTag: editingTest.examTag || "",
        mode: editingTest.mode || defaultMode || "",
        testCategory: editingTest.testCategory || "topic",
        subject: "",
        chapter: "",
        topic: (editingTest.topic && typeof editingTest.topic === "object" ? (editingTest.topic as any)._id : editingTest.topic) || "",
        instructions: "",
        negativeMarking: editingTest.negativeMarking || false,
        durationMins: editingTest.durationMins || 180,
        scheduledAt: scheduledAtFormatted,
        isLive: editingTest.isLive || false,
        isActive: editingTest.isActive !== false,
      });
    } else {
      setSelectedSubject("");
      setSelectedChapter("");
      form.reset({
        title: "",
        examTag: "",
        mode: defaultMode || "",
        testCategory: "topic",
        subject: "",
        chapter: "",
        topic: "",
        instructions: "",
        negativeMarking: false,
        durationMins: 180,
        scheduledAt: "",
        isLive: false,
        isActive: true,
      });
      setInstructionsList([]);
      setNewInstruction("");
    }
  }, [editingTest, form, isOpen]);

  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => subjectsApi.getAllSubjects(),
    enabled: isOpen
  });

  const { data: chaptersData, isLoading: isLoadingChapters } = useQuery({
    queryKey: ["admin-chapters-by-subject", selectedSubject],
    queryFn: () => chaptersApi.getAllChapters({ subject: selectedSubject }),
    enabled: isOpen && !!selectedSubject
  });

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["admin-topics-by-chapter", selectedChapter],
    queryFn: () => topicsApi.getAllTopics({ chapter: selectedChapter }),
    enabled: isOpen && !!selectedChapter
  });

  const subjectsList = subjectsData?.data || [];
  const chaptersList = chaptersData?.data || [];
  const topicsList = topicsData?.data || [];

  const handleFormSubmit = (values: any) => {
    onSubmit({
      ...values,
      instructions: JSON.stringify(instructionsList)
    });
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructionsList([...instructionsList, newInstruction.trim()]);
      setNewInstruction("");
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructionsList(instructionsList.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingTest ? "Edit Test" : "Create Test"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingTest
                ? "Make changes to the test configuration here."
                : "Fill in the details below to add a new test or mock exam."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="px-10 py-8 space-y-8">
            
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Test Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. JEE Full Mock Test 1" 
                      className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control as any}
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

            {!defaultMode && (
              <FormField
                control={form.control as any}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Mode <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="practice">Practice</SelectItem>
                        <SelectItem value="mock">Mock</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(form.watch("mode") === "practice" || defaultMode === "practice") && (
              <>
                <FormField
                  control={form.control as any}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Subject <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          setSelectedSubject(val);
                          form.setValue("chapter", "");
                          form.setValue("topic", "");
                          setSelectedChapter("");
                        }} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingSubjects ? (
                            <SelectItem value="loading" disabled>Loading subjects...</SelectItem>
                          ) : subjectsList.length > 0 ? (
                            subjectsList.map((s: any) => (
                              <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>No subjects found</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control as any}
                  name="chapter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Chapter <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          setSelectedChapter(val);
                          form.setValue("topic", "");
                        }} 
                        value={field.value || ""}
                        disabled={!selectedSubject}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
                            <SelectValue placeholder="Select Chapter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingChapters ? (
                            <SelectItem value="loading" disabled>Loading chapters...</SelectItem>
                          ) : chaptersList.length > 0 ? (
                            chaptersList.map((c: any) => (
                              <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>No chapters found</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Topic <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                        disabled={!selectedChapter}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
                            <SelectValue placeholder="Select Topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingTopics ? (
                            <SelectItem value="loading" disabled>Loading topics...</SelectItem>
                          ) : topicsList.length > 0 ? (
                            topicsList.map((t: any) => (
                              <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>No topics found</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* <FormField
              control={form.control as any}
              name="testCategory"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">Full Syllabus</SelectItem>
                        <SelectItem value="subject">Subject</SelectItem>
                        <SelectItem value="chapter">Chapter</SelectItem>
                        <SelectItem value="topic">Topic</SelectItem>
                        <SelectItem value="pyq">PYQ</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <FormField
                control={form.control as any}
                name="durationMins"
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
              {/* <FormField
                control={form.control as any}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Scheduled At (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type={"datetime-local" as any} 
                        className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="space-y-2.5">
              <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Instructions</FormLabel>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. Total duration is 1 hour." 
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInstruction();
                    }
                  }}
                  className="h-11 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base flex-1" 
                />
                <Button 
                  type="button" 
                  onClick={handleAddInstruction}
                  className="h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {instructionsList.length > 0 && (
                <div className="mt-4 space-y-2">
                  {instructionsList.map((inst, index) => (
                    <div key={index} className="flex items-start justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg group">
                      <span className="text-sm text-slate-700 font-medium flex-1 pt-0.5">{inst}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveInstruction(index)}
                        className="h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-50 -mr-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm mt-4">
              <FormField
                control={form.control as any}
                name="negativeMarking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between pb-4 border-b border-slate-200/60">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Negative Marking</FormLabel>
                      <p className="text-sm text-slate-500">
                        Enable deductions for incorrect answers in this test.
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
              
              {/* <FormField
                control={form.control as any}
                name="isLive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between pb-4 border-b border-slate-200/60">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Live Test</FormLabel>
                      <p className="text-sm text-slate-500">
                        Mark this as a live scheduled test for students.
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
              /> */}
              
              <FormField
                control={form.control as any}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Active Status</FormLabel>
                      <p className="text-sm text-slate-500">
                        Make this test visible and accessible to students.
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
                {isPending ? "Saving..." : "Save Test"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
