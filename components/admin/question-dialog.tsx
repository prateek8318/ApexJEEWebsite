"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Subject, Topic, Question } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { Plus, Trash2, ImageIcon, ImagePlus } from "lucide-react";

const questionSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  topic: z.string().min(1, "Topic is required."),
  questionText: z.string().min(1, "Question text is required."),
  questionImage: z.any().optional(),
  questionType: z.enum(["single", "multiple", "integer"]),
  options: z.array(
    z.object({ value: z.string().min(1, "Option text is required.") })
  ).optional(),
  answer: z.array(z.number()).optional(),
  integerAnswer: z.coerce.number().optional(),
  explanation: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  examTag: z.string().optional(),
  marks: z.coerce.number().default(4),
  negativeMarks: z.coerce.number().default(0),
  sourceType: z.enum(["pyq", "practice", "mock", "all"]).default("practice"),
  sourceExam: z.string().optional(),
  sourceYear: z.coerce.number().optional(),
  sourceShift: z.coerce.number().optional(),
  sourceInstitute: z.string().optional(),
  explanationImage: z.any().optional(),
  isActive: z.boolean().default(true),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;

type QuestionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: QuestionFormValues, questionImageFile: File | null, explanationFiles: FileList | null) => void;
  isPending: boolean;
  editingQuestion?: Question | null;
};

export default function QuestionDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingQuestion,
}: QuestionDialogProps) {
  
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  
  const [qPreviewUrl, setQPreviewUrl] = useState<string | null>(null);
  const [ePreviewCount, setEPreviewCount] = useState<number>(0);

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

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema as any),
    defaultValues: {
      subject: "",
      chapter: "",
      topic: "",
      questionText: "",
      questionType: "single",
      options: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
      answer: [],
      integerAnswer: 0,
      explanation: "",
      difficulty: "medium",
      examTag: "",
      marks: 4,
      negativeMarks: 1,
      sourceType: "practice",
      sourceExam: "",
      sourceYear: new Date().getFullYear(),
      sourceShift: 1,
      sourceInstitute: "",
      isActive: true,
    },
  });

  const questionType = form.watch("questionType");
  const currentAnswers = form.watch("answer") || [];

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (editingQuestion) {
      const subjectId = typeof editingQuestion.subject === "object" ? (editingQuestion.subject as Subject)._id : editingQuestion.subject;
      const chapterId = typeof editingQuestion.chapter === "object" ? (editingQuestion.chapter as Chapter)._id : editingQuestion.chapter;
      
      setSelectedSubject(subjectId);
      setSelectedChapter(chapterId);

      setQPreviewUrl(
        editingQuestion.questionImage 
          ? (typeof editingQuestion.questionImage === 'string' ? editingQuestion.questionImage : (editingQuestion.questionImage as any).url)
          : null
      );
      setEPreviewCount(editingQuestion.explanationImage?.length || 0);

      form.reset({
        subject: subjectId,
        chapter: chapterId,
        topic: typeof editingQuestion.topic === "object" ? (editingQuestion.topic as Topic)._id : editingQuestion.topic,
        questionText: editingQuestion.questionText,
        questionType: editingQuestion.questionType || "single",
        options: editingQuestion.options ? editingQuestion.options.map(opt => ({ value: opt })) : [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
        answer: editingQuestion.answer || [],
        integerAnswer: editingQuestion.integerAnswer || 0,
        explanation: editingQuestion.explanation || "",
        difficulty: editingQuestion.difficulty || "medium",
        examTag: editingQuestion.examTag || "",
        marks: editingQuestion.marks || 4,
        negativeMarks: editingQuestion.negativeMarks || 0,
        sourceType: editingQuestion.source?.type || "practice",
        sourceExam: editingQuestion.source?.exam || "",
        sourceYear: editingQuestion.source?.year || new Date().getFullYear(),
        sourceShift: editingQuestion.source?.shift || 1,
        sourceInstitute: editingQuestion.source?.institute || "",
        isActive: editingQuestion.isActive !== false,
      });
    } else {
      setSelectedSubject("");
      setSelectedChapter("");
      setQPreviewUrl(null);
      setEPreviewCount(0);
      form.reset({
        subject: "",
        chapter: "",
        topic: "",
        questionText: "",
        questionType: "single",
        options: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
        answer: [],
        integerAnswer: 0,
        explanation: "",
        difficulty: "medium",
        examTag: "",
        marks: 4,
        negativeMarks: 1,
        sourceType: "practice",
        sourceExam: "",
        sourceYear: new Date().getFullYear(),
        sourceShift: 1,
        sourceInstitute: "",
        isActive: true,
      });
    }
    
    return () => {
      if (qPreviewUrl && qPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(qPreviewUrl);
      }
    };
  }, [editingQuestion, form, isOpen]);

  const toggleAnswer = (index: number) => {
    if (questionType === "single") {
      form.setValue("answer", [index]);
    } else if (questionType === "multiple") {
      const current = form.getValues("answer") || [];
      if (current.includes(index)) {
        form.setValue("answer", current.filter((i) => i !== index));
      } else {
        form.setValue("answer", [...current, index]);
      }
    }
  };

  const handleFormSubmit = (values: QuestionFormValues) => {
    const qFile = form.getValues("questionImage");
    const eFiles = form.getValues("explanationImage");
    onSubmit(
      values, 
      qFile instanceof FileList && qFile.length > 0 ? qFile[0] : null,
      eFiles instanceof FileList && eFiles.length > 0 ? eFiles : null
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingQuestion ? "Edit Question" : "Add Question"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingQuestion
                ? "Make changes to the question details here."
                : "Fill in the details below to create a new question for the question bank."}
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
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Topic <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTopics || !selectedChapter}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder={selectedChapter ? "Select topic" : "Wait..."} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
              name="questionText"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Question Text <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write the question here (LaTeX supported if implemented)..." 
                      className="min-h-[120px] px-4 py-3 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2 resize-y" 
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
                name="questionType"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Question Type <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("answer", []);
                        form.setValue("integerAnswer", 0);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Choice (SCQ)</SelectItem>
                        <SelectItem value="multiple">Multiple Choice (MCQ)</SelectItem>
                        <SelectItem value="integer">Integer Type</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Question Image (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative group mt-2 h-16">
                        <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden transition-colors group-hover:border-slate-300 group-hover:bg-slate-100">
                          {qPreviewUrl ? (
                            <img src={qPreviewUrl} alt="Question preview" className="w-full h-full object-cover opacity-60" />
                          ) : (
                            <div className="flex items-center gap-2 text-slate-500">
                              <ImageIcon className="w-5 h-5" />
                              <span className="text-sm font-semibold">Upload Image</span>
                            </div>
                          )}
                          {qPreviewUrl && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                               <span className="text-white text-sm font-semibold">Change Image</span>
                             </div>
                          )}
                        </div>
                        <Input
                          type={"file" as any}
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            const files = e.target.files;
                            onChange(files);
                            if (files && files.length > 0) {
                              const newUrl = URL.createObjectURL(files[0]);
                              if (qPreviewUrl && qPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(qPreviewUrl);
                              setQPreviewUrl(newUrl);
                            }
                          }}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 shadow-sm mt-4">
              <h3 className="text-slate-900 font-bold text-lg mb-6">Answers & Options</h3>
              
              {(questionType === "single" || questionType === "multiple") ? (
                <div className="space-y-5">
                  {optionFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                      <div className="flex items-center justify-center bg-slate-100 rounded-lg p-2 h-12 w-12 shrink-0">
                        <Checkbox 
                          checked={currentAnswers.includes(index)}
                          onCheckedChange={() => toggleAnswer(index)}
                          className="w-5 h-5 data-[state=checked]:bg-blue-600 border-slate-300"
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`options.${index}.value`}
                        render={({ field: inputField }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <Input 
                                placeholder={`Option ${String.fromCharCode(65 + index)}`} 
                                className="h-12 border-none shadow-none focus-visible:ring-0 text-base px-2" 
                                {...inputField} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {optionFields.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-10 w-10 shrink-0">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => appendOption({ value: "" })}
                      className="h-12 px-6 border-dashed border-2 border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 bg-white"
                    >
                      <Plus className="mr-2 h-5 w-5" /> Add Another Option
                    </Button>
                  </div>
                  {form.formState.errors.answer && (
                     <p className="text-sm font-medium text-destructive mt-2 bg-red-50 p-3 rounded-lg border border-red-100">{form.formState.errors.answer.message}</p>
                  )}
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="integerAnswer"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Correct Integer Answer</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="any" 
                          className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2 max-w-xs" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Positive Marks</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-12 px-4 bg-white border-slate-200 shadow-sm text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="negativeMarks"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Negative Marks</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-12 px-4 bg-white border-slate-200 shadow-sm text-base" {...field} />
                    </FormControl>
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
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm text-base">
                          <SelectValue />
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
              <FormField
                control={form.control}
                name="examTag"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Exam Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JEE 2024" className="h-12 px-4 bg-white border-slate-200 shadow-sm text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Explanation (Solution)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed explanation..." 
                      className="min-h-[120px] px-4 py-3 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base resize-y" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explanationImage"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Explanation Images (Optional, Multiple)</FormLabel>
                  <FormControl>
                    <div className="relative group mt-2 h-20">
                      <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-colors group-hover:border-slate-300 group-hover:bg-slate-100">
                        {ePreviewCount > 0 ? (
                           <div className="flex flex-col items-center">
                             <ImagePlus className="w-6 h-6 text-blue-500 mb-1" />
                             <span className="text-sm font-semibold text-slate-700">{ePreviewCount} file(s) selected</span>
                           </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-500">
                            <ImagePlus className="w-6 h-6" />
                            <span className="text-sm font-semibold">Upload Images</span>
                          </div>
                        )}
                      </div>
                      <Input
                        type={"file" as any}
                        accept="image/*"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          onChange(e.target.files);
                          setEPreviewCount(e.target.files ? e.target.files.length : 0);
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border border-slate-200 p-6 rounded-2xl bg-white shadow-sm mt-4">
              <div className="md:col-span-5 border-b border-slate-100 pb-2">
                <h3 className="text-slate-900 font-bold text-lg">Source Information</h3>
                <p className="text-sm text-slate-500 mt-1">Track where this question originated from.</p>
              </div>
              <FormField
                control={form.control}
                name="sourceType"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm">Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-slate-50 border-slate-200 shadow-none"><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pyq">PYQ</SelectItem>
                        <SelectItem value="practice">Practice</SelectItem>
                        <SelectItem value="mock">Mock</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceExam"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm">Exam</FormLabel>
                    <FormControl><Input placeholder="JEE Main" className="h-11 bg-slate-50 border-slate-200 shadow-none" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceYear"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm">Year</FormLabel>
                    <FormControl><Input type="number" className="h-11 bg-slate-50 border-slate-200 shadow-none" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceShift"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm">Shift</FormLabel>
                    <FormControl><Input type="number" className="h-11 bg-slate-50 border-slate-200 shadow-none" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceInstitute"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm">Institute</FormLabel>
                    <FormControl><Input placeholder="NTA" className="h-11 bg-slate-50 border-slate-200 shadow-none" {...field} /></FormControl>
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
                      Make this question available for tests and practice.
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
                {isPending ? "Saving..." : "Save Question"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
