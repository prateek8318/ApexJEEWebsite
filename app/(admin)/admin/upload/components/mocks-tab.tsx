"use client";

import React, { useState } from "react";
import { Pencil, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/admin/questions";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { testsApi } from "@/lib/api/admin/tests";
import { toast } from "sonner";
import { Question as QuestionType, Subject, Chapter, Test } from "@/types/admin-api";
import TestDialog from "@/components/admin/test-dialog";

export function MocksTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Form States
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [questionType, setQuestionType] = useState("single");
  const [examTag, setExamTag] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [integerAnswer, setIntegerAnswer] = useState("");
  const [marks, setMarks] = useState("4");
  const [negativeMarks, setNegativeMarks] = useState("1");
  const [difficulty, setDifficulty] = useState("medium");
  const [solution, setSolution] = useState("");
  
  // New source fields
  const [sourceType] = useState("mock");
  const [sourceExam, setSourceExam] = useState("");
  const [sourceYear, setSourceYear] = useState(new Date().getFullYear().toString());
  const [sourceShift, setSourceShift] = useState("1");
  const [sourceInstitute, setSourceInstitute] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Test Mapping States
  const [selectedTestId, setSelectedTestId] = useState("");
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  // Files
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [explanationFiles, setExplanationFiles] = useState<FileList | null>(null);

  const queryClient = useQueryClient();

  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["admin-questions", search, "mock", page, limit],
    queryFn: () => questionsApi.getAllQuestions({ search, sourceType: "mock", page, limit }),
  });

  const { data: testsDataResponse } = useQuery({
    queryKey: ["admin-tests", "mock"],
    queryFn: () => testsApi.getAllTests({ search: "", mode: "mock", limit: 100 }),
  });
  const availableTests = testsDataResponse?.data || [];

  const createTestMutation = useMutation({
    mutationFn: (data: Partial<Test>) => testsApi.createTest(data),
    onSuccess: (res) => {
      toast.success("Mock Test created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-tests", "mock"] });
      setIsTestDialogOpen(false);
      if (res.data?._id) {
        setSelectedTestId(res.data._id);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create mock test");
    },
  });

  const addQuestionsToTestMutation = useMutation({
    mutationFn: ({ testId, qId }: { testId: string; qId: string }) => 
      testsApi.addQuestions(testId, { questions: [{ question: qId }] }),
    onSuccess: () => {
      toast.success("Question mapped to test successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: (formData: FormData) => testsApi.uploadWordQuestions(formData),
    onSuccess: (res: any) => {
      toast.success(res.message || "Bulk upload successful!");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
      setBulkFile(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to bulk upload questions");
    },
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => subjectsApi.getAllSubjects({}),
  });

  const { data: chaptersData } = useQuery({
    queryKey: ["admin-chapters-by-subject", subject],
    queryFn: () => chaptersApi.getAllChapters({ subject }),
    enabled: !!subject,
  });

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["admin-topics-by-chapter", chapter],
    queryFn: () => topicsApi.getAllTopics({ chapter }),
    enabled: !!chapter,
  });

  const questionsList = questionsData?.data || [];
  const subjects = subjectsData?.data || [];
  const chapters = chaptersData?.data || [];
  const topicsList = topicsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => questionsApi.createQuestion(formData),
    onSuccess: () => {
      toast.success("Question created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      // Reset some fields
      setQuestionText(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD(""); setSolution("");
      setQuestionImage(null); setExplanationFiles(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create question");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionsApi.deleteQuestion(id),
    onSuccess: () => {
      toast.success("Question deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
  });

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !chapter || !questionText) {
      toast.error("Please fill all required fields");
      return;
    }
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    if (topic) formData.append("topic", topic);
    formData.append("questionType", questionType);
    formData.append("difficulty", difficulty);
    formData.append("questionText", questionText);
    formData.append("marks", marks);
    formData.append("negativeMarks", negativeMarks);
    if (examTag) formData.append("examTag", examTag);
    formData.append("isActive", String(isActive));
    
    if (questionType === "integer") {
      formData.append("integerAnswer", integerAnswer);
    } else {
      const options = [optionA, optionB, optionC, optionD];
      formData.append("options", JSON.stringify(options));
      
      const answers = [];
      if (correctAnswer === "A") answers.push(0);
      if (correctAnswer === "B") answers.push(1);
      if (correctAnswer === "C") answers.push(2);
      if (correctAnswer === "D") answers.push(3);
      formData.append("answer", JSON.stringify(answers));
    }

    if (solution) formData.append("explanation", solution);

    const sourceData = {
      type: sourceType,
      exam: sourceExam,
      year: Number(sourceYear),
      shift: Number(sourceShift),
      institute: sourceInstitute
    };
    formData.append("source", JSON.stringify(sourceData));

    if (questionImage) {
      formData.append("questionImage", questionImage);
    }
    if (explanationFiles) {
      for (let i = 0; i < explanationFiles.length; i++) {
        formData.append("explanationImage", explanationFiles[i]);
      }
    }

    createMutation.mutate(formData);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Pencil size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Add Mock Test Questions</h2>
          </div>
        </div>

        {/* --- TEST MAPPING SECTION --- */}
        <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Map to Mock Test <span className="text-red-500">*</span></h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Select a Mock Test to add questions to.</p>
            </div>
            <button onClick={() => setIsTestDialogOpen(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors border border-indigo-100">
              + Create New Mock Test
            </button>
          </div>
          <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none appearance-none bg-white font-medium text-slate-700">
            <option value="">-- Select a Mock Test --</option>
            {availableTests.map((t: any) => (
              <option key={t._id} value={t._id}>{t.title} {t.examTag ? `(${t.examTag})` : ''}</option>
            ))}
          </select>
        </div>

        {selectedTestId ? (
          <>
            {/* TABS */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-px">
              <button onClick={() => setUploadMode("single")} className={cn("px-5 py-2.5 text-sm font-bold border-b-2 transition-colors", uploadMode === "single" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}>Add Single Question</button>
              <button onClick={() => setUploadMode("bulk")} className={cn("px-5 py-2.5 text-sm font-bold border-b-2 transition-colors", uploadMode === "bulk" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}>Bulk Upload (Word doc)</button>
            </div>

            {uploadMode === "single" ? (

        <form onSubmit={handleSaveQuestion} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Subject <span className="text-red-500">*</span></label>
              <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(""); setTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-500 focus:border-blue-500 outline-none appearance-none bg-white" required>
                <option value="">Select subject</option>
                {subjects.map((s: Subject) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Chapter <span className="text-red-500">*</span></label>
              <select value={chapter} onChange={(e) => { setChapter(e.target.value); setTopic(""); }} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-500 focus:border-blue-500 outline-none appearance-none bg-white" required disabled={!subject}>
                <option value="">Select chapter</option>
                {chapters.map((c: Chapter) => (
                  <option key={c._id} value={c._id}>Ch {c.chapterNumber}: {c.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white" disabled={isLoadingTopics || !chapter}>
                <option value="">Select topic</option>
                {topicsList.map((t: any) => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Question Type <span className="text-red-500">*</span></label>
              <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                <option value="single">MCQ - Single Correct</option>
                <option value="multiple">MCQ - Multiple Correct</option>
                <option value="integer">Integer Type</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Question Image (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setQuestionImage(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Question Text <span className="text-[10px] text-slate-400 font-normal">(* LaTeX supported)</span> <span className="text-red-500">*</span></label>
            <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={4} placeholder="Enter question text here. Use \(\frac{1}{2}\) for fractions, etc." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none resize-none" required />
          </div>

          {questionType === "integer" ? (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Integer Answer <span className="text-red-500">*</span></label>
              <input value={integerAnswer} onChange={(e) => setIntegerAnswer(e.target.value)} type="number" placeholder="e.g. 5" className="w-full max-w-xs px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-600">Answer Options <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <div className="bg-slate-50 px-4 py-2.5 border-r border-slate-200 text-sm font-bold text-slate-500">A</div>
                  <input value={optionA} onChange={(e) => setOptionA(e.target.value)} type="text" placeholder="Option A" className="w-full px-4 py-2.5 text-sm outline-none" required />
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <div className="bg-slate-50 px-4 py-2.5 border-r border-slate-200 text-sm font-bold text-slate-500">B</div>
                  <input value={optionB} onChange={(e) => setOptionB(e.target.value)} type="text" placeholder="Option B" className="w-full px-4 py-2.5 text-sm outline-none" required />
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <div className="bg-slate-50 px-4 py-2.5 border-r border-slate-200 text-sm font-bold text-slate-500">C</div>
                  <input value={optionC} onChange={(e) => setOptionC(e.target.value)} type="text" placeholder="Option C" className="w-full px-4 py-2.5 text-sm outline-none" required />
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <div className="bg-slate-50 px-4 py-2.5 border-r border-slate-200 text-sm font-bold text-slate-500">D</div>
                  <input value={optionD} onChange={(e) => setOptionD(e.target.value)} type="text" placeholder="Option D" className="w-full px-4 py-2.5 text-sm outline-none" required />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {questionType !== "integer" && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600">Correct Answer <span className="text-red-500">*</span></label>
                <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Positive Marks <span className="text-red-500">*</span></label>
              <input value={marks} onChange={(e) => setMarks(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Negative Marks</label>
              <input value={negativeMarks} onChange={(e) => setNegativeMarks(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            {questionType === "integer" && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600">Exam Tag</label>
                <input value={examTag} onChange={(e) => setExamTag(e.target.value)} type="text" placeholder="e.g. JEE 2024" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Step-by-Step Solution</label>
            <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} placeholder="Provide a detailed step-by-step solution..." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50 mt-2">
            <div className="flex items-center justify-between md:pr-4">
              <div>
                <label className="text-sm font-semibold text-slate-800">Explanation Images</label>
                <p className="text-xs text-slate-500 mt-0.5">Upload solution diagrams (multiple allowed)</p>
              </div>
              <input type="file" multiple accept="image/*" onChange={(e) => setExplanationFiles(e.target.files)} className="max-w-[200px] text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            
            <div className="flex items-center justify-between md:pl-4 md:border-l border-slate-200">
              <div>
                <label className="text-sm font-semibold text-slate-800">Active Status</label>
                <p className="text-xs text-slate-500 mt-0.5">Make available for tests and practice.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border border-slate-200 p-4 rounded-xl bg-white shadow-sm mt-4">
            <div className="md:col-span-5 border-b border-slate-100 pb-2 mb-2">
              <h3 className="text-slate-900 font-bold text-sm">Source Information</h3>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Type</label>
              <select value={sourceType} disabled className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 bg-slate-50 outline-none">
                <option value="mock">Mock</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Exam</label>
              <input value={sourceExam} onChange={(e) => setSourceExam(e.target.value)} type="text" placeholder="e.g. JEE Main" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Year</label>
              <input value={sourceYear} onChange={(e) => setSourceYear(e.target.value)} type="number" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Shift</label>
              <input value={sourceShift} onChange={(e) => setSourceShift(e.target.value)} type="number" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Institute</label>
              <input value={sourceInstitute} onChange={(e) => setSourceInstitute(e.target.value)} type="text" placeholder="e.g. NTA" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-4">
            <button type="button" onClick={() => { setQuestionText(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD(""); setSolution(""); setQuestionImage(null); setExplanationFiles(null); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">
              Clear Form
            </button>
            <button type="submit" disabled={createMutation.isPending || addQuestionsToTestMutation.isPending} className="px-6 py-2.5 bg-[#F5A623] text-white font-bold text-sm rounded-lg hover:bg-orange-500 shadow-md disabled:opacity-50">
              {createMutation.isPending || addQuestionsToTestMutation.isPending ? "Saving..." : "Save Question"}
            </button>
          </div>
        </form>
        ) : (
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-800">Upload Word Document</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">Upload a .docx file formatted correctly. The parser will automatically extract questions, options, answers, and metadata.</p>
            </div>
            <input 
              type="file" 
              accept=".docx"
              onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
              className="max-w-xs text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button 
              onClick={() => {
                if (!bulkFile) return toast.error("Please select a file first");
                const fd = new FormData();
                fd.append("wordFile", bulkFile);
                fd.append("testId", selectedTestId);
                bulkUploadMutation.mutate(fd);
              }}
              disabled={!bulkFile || bulkUploadMutation.isPending}
              className="px-6 py-2.5 bg-[#4F46E5] text-white font-bold text-sm rounded-lg hover:bg-indigo-600 disabled:opacity-50 mt-4"
            >
              {bulkUploadMutation.isPending ? "Uploading..." : "Upload & Map Questions"}
            </button>
          </div>
        )}
      </>
      ) : (
        <div className="py-12 text-center border border-slate-100 rounded-xl bg-slate-50 text-slate-500 text-sm">
          Please select or create a Mock Test to start adding questions.
        </div>
      )}
      </div>
      
      <TestDialog 
        isOpen={isTestDialogOpen}
        onOpenChange={setIsTestDialogOpen}
        onSubmit={(values) => {
          createTestMutation.mutate({ ...values, mode: "mock" });
        }}
        isPending={createTestMutation.isPending}
        defaultMode="mock"
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">All Mock Questions (Bank)</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} type="text" placeholder="Search questions..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50/50" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center w-[40px]">S.NO.</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">QUESTION TEXT</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">SUBJECT</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">TYPE</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">DIFFICULTY</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingQuestions ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500 text-sm">Loading questions...</td></tr>
              ) : questionsList.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500 text-sm">No questions found</td></tr>
              ) : (
                questionsList.map((question: QuestionType, index: number) => (
                  <tr key={question._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-4 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 pr-8">
                      <div className="truncate max-w-[320px] text-sm font-bold text-slate-700" title={question.questionText}>
                        {question.questionText}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn("px-2 py-1 rounded text-[9px] font-bold", typeof question.subject === 'object' && (question.subject as Subject).name === 'Physics' ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500")}>
                        {typeof question.subject === 'object' ? (question.subject as Subject).name : question.subject}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2 py-1 rounded text-[9px] font-bold capitalize bg-slate-100 text-slate-600">
                        {question.questionType}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn("px-2 py-1 rounded text-[9px] font-bold uppercase", question.difficulty === 'hard' ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-600")}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => {if(confirm("Delete question?")) deleteMutation.mutate(question._id);}} className="px-3 py-1.5 border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 rounded text-[10px] font-bold transition-colors">Del</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs border border-slate-200 rounded px-2 py-1 outline-none bg-white text-slate-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <span className="text-xs text-slate-500">
            Showing {questionsList.length} of {questionsData?.totalResult  || 0} questions
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-slate-700">
              Page {page} of {questionsData?.totalPage  || 1}
            </span>
            <button 
              disabled={page === (questionsData?.totalPage  || 1)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
