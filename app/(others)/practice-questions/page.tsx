"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userSubjectApi } from "@/lib/api/user/subject";
import { userTopicApi } from "@/lib/api/user/topic";
import { userTestApi } from "@/lib/api/user/test";
import ChapterSidebar from "../study-materials/components/chapter-sidebar";
import { QuestionPagination } from "./components/QuestionPagination";
import { QuestionHeader } from "./components/QuestionHeader";
import { QuestionBody } from "./components/QuestionBody";
import { QuestionActionBar } from "./components/QuestionActionBar";
import { SessionOverview } from "./components/SessionOverview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type QuestionStatus = "correct" | "wrong" | "skipped" | "current" | "untouched";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all active subjects
  const { data: subjectsData, isLoading: isSubjectsLoading } = useQuery({
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

  // Mutations
  const startAttemptMutation = useMutation({
    mutationFn: (testId: string) => userTestApi.startTestAttempt(testId),
    onSuccess: (res) => {
      setAttemptId(res.data._id);
    }
  });

  const submitAttemptMutation = useMutation({
    mutationFn: (payload: { attemptId: string, data: any }) => userTestApi.submitTestAttempt(payload.attemptId, payload.data),
    onSuccess: () => {
      // Handle success (show score, go back to selection, etc)
      setActiveTestId(null);
      setAttemptId(null);
      setUserResponses({});
    }
  });

  const handleStartPractice = (testId: string) => {
    setActiveTestId(testId);
    startAttemptMutation.mutate(testId);
  };

  // Fetch active test details
  const { data: testData, isLoading: isTestLoading } = useQuery({
    queryKey: ["practice-test-detail", activeTestId],
    queryFn: () => userTestApi.getPracticeTestDetail(activeTestId!),
    enabled: !!activeTestId,
  });
  const testDetails = testData?.data;

  // Fetch active test questions
  const { data: questionsData, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ["practice-test-questions", activeTestId],
    queryFn: () => userTestApi.getPracticeTestQuestions(activeTestId!),
    enabled: !!activeTestId,
  });
  const questions = questionsData?.data || [];
  const TOTAL = questions.length;

  const [currentQ, setCurrentQ] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<number, QuestionStatus>>({});

  useEffect(() => {
    if (questions.length > 0) {
      const initialMap: Record<number, QuestionStatus> = { 1: "current" };
      for (let i = 2; i <= questions.length; i++) {
        initialMap[i] = "untouched";
      }
      setStatusMap(initialMap);
      setCurrentQ(1);
      setSelected(null);
      setShowSolution(false);
    }
  }, [questions.length, activeTestId]);

  const activeQuestionItem = questions[currentQ - 1];
  const question = activeQuestionItem?.question as any; // Cast for now

  const goTo = (n: number) => {
    if (n < 1 || n > TOTAL) return;
    setStatusMap((prev) => ({
      ...prev,
      [currentQ]: prev[currentQ] === "current" ? "untouched" : prev[currentQ],
      [n]: "current",
    }));
    setCurrentQ(n);
    
    // Restore selected state if previously answered
    const prevAnswer = userResponses[questions[n - 1].question._id];
    if (prevAnswer) {
      setSelected(prevAnswer.selected);
      setShowSolution(true); // In practice mode, we might want to show solution again
    } else {
      setSelected(null);
      setShowSolution(false);
    }
  };

  const handleSubmit = () => {
    if (!selected || !question) return;
    
    let isCorrect = false;
    const correctOpt = question.options?.find((o: any) => o.isCorrect);
    if (correctOpt) {
      isCorrect = selected === correctOpt._id || selected === correctOpt.text;
    } else if (question.correctOption) {
      isCorrect = selected === question.correctOption;
    }

    setStatusMap((prev) => ({
      ...prev,
      [currentQ]: isCorrect ? "correct" : "wrong",
    }));
    
    setUserResponses(prev => ({
      ...prev,
      [question._id]: {
        question: question._id,
        selectedOptions: [selected], // Simple assumption for single choice
        selected: selected
      }
    }));
    
    setShowSolution(true);
  };

  const handleSkip = () => {
    setStatusMap((prev) => ({ ...prev, [currentQ]: "skipped" }));
    if (currentQ < TOTAL) goTo(currentQ + 1);
  };

  const handleKnowAnswer = () => {
    setStatusMap((prev) => ({ ...prev, [currentQ]: "correct" }));
    if (currentQ < TOTAL) goTo(currentQ + 1);
  };

  const finishTest = () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    const responsesArray = Object.values(userResponses).map(r => ({
      question: r.question,
      selectedOptions: r.selectedOptions
    }));
    
    submitAttemptMutation.mutate({ 
      attemptId, 
      data: { responses: responsesArray, autoSubmitted: false } 
    });
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
            <button 
              onClick={finishTest}
              disabled={isSubmitting}
              className="absolute top-4 right-4 z-10 px-4 py-2 bg-indigo-600 text-white rounded-lg border shadow-sm text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Finish Test"}
            </button>
            {/* Pagination bar */}
            <QuestionPagination
              total={TOTAL}
              current={currentQ}
              statusMap={statusMap}
              onChange={goTo}
            />

            {/* Question card */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <QuestionHeader
                  questionNumber={currentQ}
                  subject={testDetails?.subject?.name || "Subject"}
                  chapter={testDetails?.chapter?.title || "Chapter"}
                  topic={testDetails?.topic?.title || "Topic"}
                  tag="MCQ"
                  exam={testDetails?.examTag || "Practice"}
                  year="Current"
                />

                {question && (
                  <QuestionBody
                    body={question.text?.en || question.body}
                    options={(question.options || []).map((o: any, i: number) => ({
                      key: String.fromCharCode(65 + i),
                      text: o.text?.en || o.text || o,
                      _id: o._id || o.id,
                      isCorrect: o.isCorrect
                    }))}
                    selected={selected}
                    onSelect={setSelected}
                    showAnswer={showSolution}
                    correctAnswer={(question.options || []).find((o: any) => o.isCorrect)?._id || question.correctOption}
                  />
                )}

                <QuestionActionBar
                  onPrev={() => currentQ > 1 && goTo(currentQ - 1)}
                  onNext={() => currentQ < TOTAL && goTo(currentQ + 1)}
                  onSkip={handleSkip}
                  onKnowAnswer={handleKnowAnswer}
                  onShowSolution={() => setShowSolution(true)}
                  onSubmit={handleSubmit}
                  canSubmit={!!selected && !showSolution}
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
        </>
      )}
    </div>
  );
}
