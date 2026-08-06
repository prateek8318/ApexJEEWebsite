"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userSubjectApi } from "@/lib/api/user/subject";
import { userTopicApi } from "@/lib/api/user/topic";
import { userTestApi } from "@/lib/api/user/test";
import { userTestAttemptApi } from "@/lib/api/user/test-attempt";
import { userFlagApi } from "@/lib/api/user/flag";
import ChapterSidebar from "../study-materials/components/chapter-sidebar";
import { QuestionPagination } from "./components/QuestionPagination";
import { QuestionHeader } from "./components/QuestionHeader";
import { QuestionBody } from "./components/QuestionBody";
import { QuestionActionBar } from "./components/QuestionActionBar";
import { SessionOverview } from "./components/SessionOverview";
import SubmitModal from "../mock-tests/components/submit-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type QuestionStatus = "correct" | "wrong" | "skipped" | "current" | "untouched";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const router = useRouter();
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all active subjects
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => userSubjectApi.getAllSubjects(),
  });
  const subjects = subjectsData?.data || [];

  useEffect(() => {
    if (subjects.length > 0 && !activeSubjectId) {
      setActiveSubjectId(subjects[0]._id);
    }
  }, [subjects, activeSubjectId]);

  // Fetch chapters for active subject
  const { data: chaptersData, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["chapters", "subject", activeSubjectId],
    queryFn: () => userSubjectApi.getChaptersBySubject(activeSubjectId!),
    enabled: !!activeSubjectId,
  });
  const chapters = chaptersData?.data || [];

  useEffect(() => {
    if (chapters.length > 0 && (!activeChapterId || !chapters.find(c => c._id === activeChapterId))) {
      setActiveChapterId(chapters[0]._id);
    }
  }, [chapters, activeChapterId]);

  // Fetch topics for active chapter
  const { data: topicsData, isLoading: isTopicsLoading } = useQuery({
    queryKey: ["topics", "chapter", activeChapterId],
    queryFn: () => userTopicApi.getTopicsByChapter(activeChapterId!),
    enabled: !!activeChapterId && !activeTestId,
  });
  const topics = topicsData?.data || [];

  useEffect(() => {
    if (topics.length > 0 && (!activeTopicId || !topics.find(t => t._id === activeTopicId))) {
      setActiveTopicId(topics[0]._id);
    }
  }, [topics, activeTopicId]);

  // Fetch practice tests for active topic
  const { data: testsData, isLoading: isTestsLoading } = useQuery({
    queryKey: ["practice-tests", "topic", activeTopicId],
    queryFn: () => userTestApi.getPracticeTestsByTopic(activeTopicId!),
    enabled: !!activeTopicId && !activeTestId,
  });
  const practiceTests = testsData?.data || [];

  const [currentQ, setCurrentQ] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [integerAnswer, setIntegerAnswer] = useState<string>("");
  const [showSolution, setShowSolution] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<number, QuestionStatus>>({});
  const [initialPalette, setInitialPalette] = useState<any[] | null>(null);

  // Mutations
  const startAttemptMutation = useMutation({
    mutationFn: (testId: string) => userTestAttemptApi.startPracticeAttempt(testId),
    onSuccess: (res) => {
      setAttemptId(res.data.attemptId);
      if (res.data.palette) {
        setInitialPalette(res.data.palette);
        
        // The backend now returns selectedOptions and integerAnswerGiven inside the palette array
        const initialResponses: Record<string, any> = {};
        res.data.palette.forEach((p: any) => {
          if (p.status !== "untouched") {
            initialResponses[p.questionId] = {
              question: p.questionId,
              selectedOptions: p.selectedOptions || [],
              integerAnswerGiven: p.integerAnswerGiven,
              correctOptions: p.correctOptions,
              correctInteger: p.correctInteger
            };
          }
        });
        setUserResponses(initialResponses);
      } else {
        setUserResponses({});
      }
    }
  });

  const submitAttemptMutation = useMutation({
    mutationFn: (payload: { attemptId: string, data?: any }) => userTestAttemptApi.submitPracticeAttempt(payload.attemptId, payload.data),
    onSuccess: (res: any) => {
      // Prevent routing if it was a duplicate fast-response due to race condition
      if (res?.data?.message?.includes("in progress")) {
        return;
      }
      
      // Instead of an alert and resetting, redirect to the review page
      if (attemptId) {
        router.push(`/practice-questions/${attemptId}/review`);
      } else {
        setActiveTestId(null);
        setAttemptId(null);
        setInitialPalette(null);
        setUserResponses({});
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const queryClient = useQueryClient();
  const toggleFlagMutation = useMutation({
    mutationFn: (params: { questionId: string, isFlagged: boolean }) => 
      params.isFlagged 
        ? userFlagApi.unflagQuestion(params.questionId) 
        : userFlagApi.flagQuestion(params.questionId),
    onSuccess: (_, variables) => {
      // Optimistically update the query cache so the flag button updates immediately
      queryClient.setQueryData(["practice-test-questions", activeTestId], (oldData: any) => {
        if (!oldData?.data) return oldData;
        const newData = [...oldData.data];
        const qIndex = newData.findIndex(q => q.question?._id === variables.questionId);
        if (qIndex !== -1) {
          newData[qIndex] = {
            ...newData[qIndex],
            question: {
              ...newData[qIndex].question,
              isFlagged: !variables.isFlagged
            }
          };
        }
        return { ...oldData, data: newData };
      });
    }
  });

  const handleStartPractice = (testId: string) => {
    setActiveTestId(testId);
    setInitialPalette(null);
    startAttemptMutation.mutate(testId);
  };

  const handleFlagQuestion = () => {
    const questionId = activeQuestionItem?.question?._id;
    if (!questionId) return;
    toggleFlagMutation.mutate({ 
      questionId, 
      isFlagged: !!activeQuestionItem.question.isFlagged 
    });
  };

  // Fetch active test details
  const { data: testData, isLoading: isTestLoading } = useQuery({
    queryKey: ["practice-test-detail", activeTestId],
    queryFn: () => userTestApi.getPracticeTestDetail(activeTestId!),
    enabled: !!activeTestId,
  });
  const testDetails = testData?.data;

  // Fetch active test questions
  const { data: questionsData } = useQuery({
    queryKey: ["practice-test-questions", activeTestId],
    queryFn: () => userTestApi.getPracticeTestQuestions(activeTestId!),
    enabled: !!activeTestId,
  });
  const questions = questionsData?.data || [];
  const TOTAL = questions.length;

  // Derived stats for submit confirmation
  const correctCount = Object.values(statusMap).filter((s) => s === "correct").length;
  const wrongCount = Object.values(statusMap).filter((s) => s === "wrong").length;
  const skippedCount = Object.values(statusMap).filter((s) => s === "skipped").length;
  const notAttemptedCount = Math.max(TOTAL - correctCount - wrongCount - skippedCount, 0);
  const statsForSubmit = {
    answered: correctCount + wrongCount,
    skipped: skippedCount,
    marked: 0,
    notAttempted: notAttemptedCount,
  };

  useEffect(() => {
    if (questions.length > 0) {
      const newMap: Record<number, QuestionStatus> = {};

      questions.forEach((qItem: any, i: number) => {
        const qId = qItem.question._id || qItem.question;
        const n = i + 1;
        
        const pItem = initialPalette?.find((p: any) => p.questionId === qId);
        if (pItem && pItem.status && pItem.status !== "untouched") {
          newMap[n] = pItem.status;
        } else {
          newMap[n] = "untouched";
        }
      });

      // Find first untouched to set as current
      const untouchedKeys = Object.keys(newMap).filter(k => newMap[Number(k)] === "untouched");
      const current = untouchedKeys.length > 0 ? Number(untouchedKeys[0]) : 1;
      // Removed newMap[current] = "current" so we don't overwrite answered status

      setStatusMap(newMap);
      setCurrentQ(current);
      
      // We must access userResponses from a stable reference, but it's guaranteed to be populated
      // immediately after startAttemptMutation. We can use setState callback to access it.
      setUserResponses((prevResponses) => {
        const qId = questions[current - 1]?.question?._id || questions[current - 1]?.question;
        const prevAnswer = prevResponses[qId];
        
        if (prevAnswer) {
          if (prevAnswer.selectedOptions) setSelectedOptions(prevAnswer.selectedOptions);
          else setSelectedOptions([]);
          
          if (prevAnswer.integerAnswerGiven !== undefined && prevAnswer.integerAnswerGiven !== null) {
            setIntegerAnswer(String(prevAnswer.integerAnswerGiven));
          } else {
            setIntegerAnswer("");
          }
          setShowSolution(true);
        } else {
          setSelectedOptions([]);
          setIntegerAnswer("");
          setShowSolution(false);
        }
        return prevResponses;
      });
    }
  }, [questions.length, activeTestId, initialPalette]);

  const activeQuestionItem = questions[currentQ - 1];
  const question = activeQuestionItem?.question as any; // Cast for now

  const goTo = (n: number) => {
    if (n < 1 || n > TOTAL) return;
    // Removed buggy statusMap update that was erasing "correct"/"wrong" statuses
    setCurrentQ(n);
    
    // Restore selected state if previously answered
    const qId = questions[n - 1].question?._id || questions[n - 1].question;
    const prevAnswer = userResponses[qId];
    if (prevAnswer) {
      if (prevAnswer.selectedOptions) setSelectedOptions(prevAnswer.selectedOptions);
      else setSelectedOptions([]);
      
      if (prevAnswer.integerAnswerGiven !== undefined && prevAnswer.integerAnswerGiven !== null) {
        setIntegerAnswer(String(prevAnswer.integerAnswerGiven));
      } else {
        setIntegerAnswer("");
      }
      setShowSolution(true); // In practice mode, we might want to show solution again
    } else {
      setSelectedOptions([]);
      setIntegerAnswer("");
      setShowSolution(false);
    }
  };

  const saveAnswerMutation = useMutation({
    mutationFn: (payload: { questionId: string, action: "answer" | "skip" | "know_and_skip" | "mark_review" | "clear", selectedOptions?: number[], integerAnswerGiven?: number }) => 
      userTestAttemptApi.savePracticeAnswer(attemptId!, payload.questionId, payload),
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error?.message || err.message;
      if (msg?.includes("Test time is over")) {
        alert("Test time is over! Submitting your attempt...");
        submitAttemptMutation.mutate({ attemptId: attemptId!, data: { autoSubmit: true } });
      } else {
        console.error("Failed to save answer", err);
      }
    }
  });

  const handleSubmit = () => {
    if (!question) return;
    if (question.questionType === "integer" && integerAnswer === "") return;
    if (question.questionType !== "integer" && selectedOptions.length === 0) return;

    const payload = {
      questionId: question._id,
      action: "answer" as const,
      selectedOptions: question.questionType === "integer" ? [] : selectedOptions,
      ...(question.questionType === "integer" ? { integerAnswerGiven: Number(integerAnswer) } : {})
    };

    saveAnswerMutation.mutate(payload, {
      onSuccess: (res: any) => {
        const isCorrect = res.data?.isCorrect || res.data?.status === "correct";

        setStatusMap((prev) => ({
          ...prev,
          [currentQ]: isCorrect ? "correct" : "wrong",
        }));

        // Normalize correct options into indices so UI highlights correctly
        const rawCorrect = res.data?.correctOptions;
        let normalizedCorrect: number[] = [];

        if (Array.isArray(rawCorrect) && rawCorrect.length > 0) {
          if (rawCorrect.every((r: any) => typeof r === "number")) {
            normalizedCorrect = rawCorrect;
          } else if (rawCorrect.every((r: any) => typeof r === "string" && r.length === 1 && /[A-Z]/.test(r))) {
            normalizedCorrect = rawCorrect.map((r: string) => r.charCodeAt(0) - 65);
          } else {
            // Possibly option IDs -> map to indices
            normalizedCorrect = (question.options || [])
              .map((o: any, i: number) => (rawCorrect.includes(o._id) ? i : -1))
              .filter((i: number) => i !== -1);
          }
        } else if (typeof rawCorrect === "string" && rawCorrect.length === 1 && /[A-Z]/.test(rawCorrect)) {
          normalizedCorrect = [rawCorrect.charCodeAt(0) - 65];
        } else if (question.answer) {
          if (typeof question.answer === "string") {
            normalizedCorrect = [question.answer.charCodeAt(0) - 65];
          } else if (Array.isArray(question.answer)) {
            normalizedCorrect = question.answer;
          }
        } else {
          normalizedCorrect = (question.options || []).map((o: any, i: number) => (o.isCorrect ? i : -1)).filter((i: number) => i !== -1);
        }

        setUserResponses(prev => ({
          ...prev,
          [question._id]: {
            question: question._id,
            selectedOptions: selectedOptions,
            integerAnswerGiven: question.questionType === "integer" ? Number(integerAnswer) : null,
            correctOptions: normalizedCorrect,
            correctInteger: res.data?.correctInteger
          }
        }));

        setShowSolution(true);

        setTimeout(() => {
          if (currentQ < TOTAL) {
            goTo(currentQ + 1);
          }
        }, 1500);
      }
    });
  };

  const handleSkip = () => {
    const currentStatus = statusMap[currentQ];
    // Don't overwrite an already answered question
    if (currentStatus === "correct" || currentStatus === "wrong") {
      if (currentQ < TOTAL) goTo(currentQ + 1);
      return;
    }

    setStatusMap((prev) => ({ ...prev, [currentQ]: "skipped" }));
    if (question) {
      saveAnswerMutation.mutate({ questionId: question._id, action: "skip" });
    }
    if (currentQ < TOTAL) goTo(currentQ + 1);
  };

  const handleKnowAnswer = () => {
    setStatusMap((prev) => ({ ...prev, [currentQ]: "correct" }));
    if (question) {
      saveAnswerMutation.mutate({ questionId: question._id, action: "know_and_skip" });
    }
    if (currentQ < TOTAL) goTo(currentQ + 1);
  };

  const finishTest = () => {
    // Show confirmation modal with current stats before final submit
    setIsSubmitModalOpen(true);
  };

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleConfirmSubmit = () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    setIsSubmitModalOpen(false);
    submitAttemptMutation.mutate({ attemptId, data: { autoSubmit: false } });
  };

  const renderTestSelection = () => {
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Select a Practice Test</h2>
        
        {isTopicsLoading ? (
          <Skeleton className="h-10 w-[200px] mb-4" />
        ) : (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {topics.map(topic => (
              <button
                key={topic._id}
                onClick={() => setActiveTopicId(topic._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTopicId === topic._id 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {topic.title}
              </button>
            ))}
            {topics.length === 0 && <p className="text-slate-500">No topics available.</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isTestsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
          ) : practiceTests.length > 0 ? (
            practiceTests.map((test: any) => (
              <div key={test._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    userTestApi.toggleFavourite(test._id).then(() => {
                       window.location.reload();
                    });
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  {test.isFavourite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ec4899" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  )}
                </button>
                <h3 className="font-semibold text-lg text-slate-800 line-clamp-2 mb-2 pr-6">{test.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{test.totalQuestions} Questions • {test.durationMins} Mins</p>
                <Button 
                  onClick={() => handleStartPractice(test._id)}
                  disabled={startAttemptMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Practice
                </Button>
              </div>
            ))
          ) : (
            <p className="text-slate-500 col-span-3">No practice tests available for this topic.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── LEFT: Chapter sidebar ── */}
      <ChapterSidebar
        subjects={subjects}
        chapters={chapters}
        activeSubjectId={activeSubjectId}
        onSubjectSelect={setActiveSubjectId}
        activeChapterId={activeChapterId}
        onChapterSelect={(id) => {
          setActiveChapterId(id);
          setActiveTestId(null);
        }}
        isLoadingChapters={isChaptersLoading}
      />

      {/* ── CENTER: question area ── */}
      {!activeTestId ? renderTestSelection() : (isTestLoading || !attemptId) ? (
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="w-[600px] h-[400px] rounded-2xl" />
        </div>
      ) : questions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-slate-500">No questions found in this test.</p>
          <Button variant="outline" onClick={() => setActiveTestId(null)}>Back to Tests</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col overflow-hidden relative">
            <div className="flex items-start justify-between border-b border-slate-100 bg-white">
              {/* Pagination bar */}
              <div className="flex-1 overflow-x-auto">
                <QuestionPagination
                  total={TOTAL}
                  current={currentQ}
                  statusMap={statusMap}
                  onChange={goTo}
                />
              </div>
              
              <div className="p-2 shrink-0">
                <button 
                  onClick={finishTest}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-md border shadow-sm text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Finish Test"}
                </button>
              </div>
            </div>

            {/* Question card */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <QuestionHeader
                  questionNumber={currentQ}
                  subject={testDetails?.subject?.name || "Subject"}
                  chapter={testDetails?.chapter?.title || "Chapter"}
                  topic={testDetails?.topic?.title || "Topic"}
                  tag={question?.questionType === "multiple" ? "MSQ" : question?.questionType === "integer" ? "INTEGER" : "MCQ"}
                  exam={testDetails?.examTag || "Practice"}
                  year="Current"
                  isFlagged={!!question?.isFlagged}
                  onToggleFlag={handleFlagQuestion}
                />

                {question && (
                  <QuestionBody
                    body={question.text?.en || question.questionText || question.body || ""}
                    options={(question.options || []).map((o: any, i: number) => ({
                      index: i,
                      label: String.fromCharCode(65 + i),
                      text: o.text?.en || o.text || o,
                    }))}
                    selectedOptions={selectedOptions}
                    integerAnswer={integerAnswer}
                    onSelectOption={(index) => {
                      if (question.questionType === "multiple") {
                        setSelectedOptions(prev => 
                          prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
                        );
                      } else {
                        setSelectedOptions([index]);
                      }
                    }}
                    onSelectInteger={setIntegerAnswer}
                    showAnswer={showSolution}
                    correctOptions={(() => {
                      const resp = userResponses[question._id]?.correctOptions;
                      if (Array.isArray(resp) && resp.length > 0) return resp;

                      // If question.answer is a string like "A", convert to index
                      if (typeof question.answer === "string") {
                        try {
                          return [question.answer.charCodeAt(0) - 65];
                        } catch (e) {
                          return [];
                        }
                      }

                      if (Array.isArray(question.answer) && question.answer.length > 0) return question.answer;

                      // Fallback to options with isCorrect flag
                      return (question.options || []).map((o: any, i: number) => (o.isCorrect ? i : -1)).filter((i: number) => i !== -1);
                    })()}
                    correctInteger={userResponses[question._id]?.correctInteger || question.integerAnswer?.toString()}
                    type={question.questionType}
                  />
                )}

                <QuestionActionBar
                  onPrev={() => currentQ > 1 && goTo(currentQ - 1)}
                  onNext={() => currentQ < TOTAL && goTo(currentQ + 1)}
                  onSkip={handleSkip}
                  onKnowAnswer={handleKnowAnswer}
                  onShowSolution={() => setShowSolution(true)}
                  onSubmit={handleSubmit}
                  canSubmit={(!showSolution) && (question?.questionType === "integer" ? integerAnswer !== "" : selectedOptions.length > 0)}
                  hasPrev={currentQ > 1}
                  hasNext={currentQ < TOTAL}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT: session overview ── */}
          <SessionOverview
            total={TOTAL}
            currentQ={currentQ}
            statusMap={statusMap}
            onSelectQ={goTo}
          />
          {isSubmitModalOpen && (
            <SubmitModal
              stats={statsForSubmit}
              onClose={() => setIsSubmitModalOpen(false)}
              onSubmit={handleConfirmSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}

// Note: Submit modal stats are computed from statusMap when needed
