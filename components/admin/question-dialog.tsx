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
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Subject, Topic, Question } from "@/types/admin-api";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { Plus, Trash2 } from "lucide-react";

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

  const { data: subjectsData } = useQuery({
    queryKey: ["admin-subjects"],
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

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? "Edit Question" : "Add Question"}</DialogTitle>
          <DialogDescription>
            {editingQuestion
              ? "Make changes to the question details here."
              : "Fill in the details to create a new question."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            
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
                      <FormControl>
                        <SelectTrigger>
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
                      <FormControl>
                        <SelectTrigger>
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
                  <FormItem>
                    <FormLabel>Topic <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedChapter}>
                      <FormControl>
                        <SelectTrigger>
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
                <FormItem>
                  <FormLabel>Question Text <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write the question here (LaTeX supported if implemented)..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("answer", []);
                        form.setValue("integerAnswer", 0);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                  <FormItem>
                    <FormLabel>Question Image (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="font-semibold mb-4">Answers & Options</h3>
              
              {(questionType === "single" || questionType === "multiple") ? (
                <div className="space-y-4">
                  {optionFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Checkbox 
                        checked={currentAnswers.includes(index)}
                        onCheckedChange={() => toggleAnswer(index)}
                      />
                      <FormField
                        control={form.control}
                        name={`options.${index}.value`}
                        render={({ field: inputField }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <Input placeholder={`Option ${index + 1}`} {...inputField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {optionFields.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendOption({ value: "" })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Option
                  </Button>
                  {form.formState.errors.answer && (
                     <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.answer.message}</p>
                  )}
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="integerAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Integer Answer</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Positive Marks</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="negativeMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Negative Marks</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
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
                  <FormItem>
                    <FormLabel>Exam Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JEE 2024" {...field} />
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
                <FormItem>
                  <FormLabel>Explanation (Solution)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed explanation..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explanationImage"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Explanation Images (Optional, Multiple)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border p-4 rounded-md">
              <div className="md:col-span-5 font-semibold text-sm">Source Info</div>
              <FormField
                control={form.control}
                name="sourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <FormItem>
                    <FormLabel>Exam</FormLabel>
                    <FormControl><Input placeholder="JEE Main" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceShift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceInstitute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute</FormLabel>
                    <FormControl><Input placeholder="NTA" {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Active (Visible to students)</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Question"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
