"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userTestApi } from "@/lib/api/user/test";

import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ZoomIn,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import SubmitModal from "./submit-modal";
import { Question, Subject } from "@/types/user-api";

interface ExamStepProps {
  testId: string;
  attemptId: string;
  testTitle: string;
  onFinishTest: (results: any) => void;
}

export default function ExamStep({ testId, attemptId, testTitle, onFinishTest }: ExamStepProps) {
  const { data: testData, isLoading, isError } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => userTestApi.getTestById(testId),
    enabled: !!testId,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { autoSubmitted?: boolean }) => {
      // format responses
      const formattedResponses = Object.entries(selectedAnswers).map(([qId, ans]) => {
        const question = questions.find((q) => q._id === qId);
        if (!question) return null;
        
        const response: any = { question: qId };
        if (question.questionType === "single" || question.questionType === "multiple") {
          response.selectedOptions = Array.isArray(ans) ? ans : [ans];
        } else if (question.questionType === "integer") {
          response.integerAnswerGiven = ans as number;
        }
        return response;
      }).filter(Boolean);

      return userTestApi.submitTestAttempt(attemptId, {
        responses: formattedResponses,
        autoSubmitted: data.autoSubmitted || false,
      });
    },
    onSuccess: (res) => {
      if (res.data) {
        onFinishTest(res.data);
      }
    }
  });

  const test = testData?.data;
  
  // Extract questions and subjects
  const questions = useMemo(() => {
    if (!test?.questions) return [];
    return test.questions.map(q => q.question as Question);
  }, [test]);

  const subjects = useMemo(() => {
    const uniqueSubjects = new Map<string, Subject | { _id: string, name: string }>();
    questions.forEach((q) => {
      if (typeof q.subject !== 'string' && q.subject) {
        uniqueSubjects.set(q.subject._id, q.subject as Subject);
      } else if (typeof q.subject === 'string') {
        uniqueSubjects.set(q.subject, { _id: q.subject, name: 'Subject' });
      }
    });
    return Array.from(uniqueSubjects.values());
  }, [questions]);

  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, "not_visited" | "skipped" | "answered" | "marked">>({});
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTimerInitialized, setIsTimerInitialized] = useState(false);

  // Initialize data
  useEffect(() => {
    if (subjects.length > 0 && !activeSectionId) {
      setActiveSectionId(subjects[0]._id);
    }
    if (test && !isTimerInitialized) {
      setTimeLeft(test.durationMins * 60);
      setIsTimerInitialized(true);
    }
  }, [subjects, test, activeSectionId, isTimerInitialized]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQId = questions[currentIndex]?._id;
      if (currentQId && !questionStatuses[currentQId]) {
        setQuestionStatuses(prev => ({ ...prev, [currentQId]: "not_visited" }));
      }
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    if (!isTimerInitialized || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerInitialized]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeQuestion = questions[currentIndex];

  const setSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const firstQIndex = questions.findIndex(q => {
       const subId = typeof q.subject === 'string' ? q.subject : q.subject._id;
       return subId === sectionId;
    });
    if (firstQIndex !== -1) {
      setCurrentIndex(firstQIndex);
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    if (!activeQuestion) return;
    const qId = activeQuestion._id;
    if (activeQuestion.questionType === "multiple") {
      setSelectedAnswers(prev => {
        const current = Array.isArray(prev[qId]) ? prev[qId] : [];
        if (current.includes(optionIdx)) {
          return { ...prev, [qId]: current.filter((x: number) => x !== optionIdx) };
        } else {
          return { ...prev, [qId]: [...current, optionIdx] };
        }
      });
    } else {
      setSelectedAnswers(prev => ({ ...prev, [qId]: [optionIdx] }));
    }
  };

  const handleIntegerInput = (val: string) => {
    if (!activeQuestion) return;
    const qId = activeQuestion._id;
    if (val === "") {
      setSelectedAnswers(prev => {
        const copy = { ...prev };
        delete copy[qId];
        return copy;
      });
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        setSelectedAnswers(prev => ({ ...prev, [qId]: num }));
      }
    }
  };

  const handleClear = () => {
    if (!activeQuestion) return;
    const qId = activeQuestion._id;
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setQuestionStatuses(prev => ({ ...prev, [qId]: "skipped" }));
  };

  const handleSkip = () => {
    if (!activeQuestion) return;
    const qId = activeQuestion._id;
    setQuestionStatuses(prev => ({ ...prev, [qId]: "skipped" }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleMarkAndNext = () => {
    if (!activeQuestion) return;
    const qId = activeQuestion._id;
    setQuestionStatuses(prev => ({ ...prev, [qId]: "marked" }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (!activeQuestion) return;
    const qId = activeQuestion._id;
    const hasAnswer = selectedAnswers[qId] !== undefined && 
      (Array.isArray(selectedAnswers[qId]) ? selectedAnswers[qId].length > 0 : true);
    
    if (hasAnswer) {
      setQuestionStatuses(prev => ({ ...prev, [qId]: "answered" }));
    } else {
      setQuestionStatuses(prev => ({ ...prev, [qId]: "skipped" }));
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getStats = () => {
    let answered = 0;
    let skipped = 0;
    let marked = 0;
    let notAttempted = 0;

    questions.forEach(q => {
      const status = questionStatuses[q._id] || "not_visited";
      const hasAnswer = selectedAnswers[q._id] !== undefined && 
        (Array.isArray(selectedAnswers[q._id]) ? selectedAnswers[q._id].length > 0 : true);

      if (status === "answered" || (status !== "marked" && hasAnswer)) {
        answered++;
      } else if (status === "marked") {
        marked++;
      } else if (status === "skipped") {
        skipped++;
      } else {
        notAttempted++;
      }
    });

    return { answered, skipped, marked, notAttempted };
  };

  const currentStats = getStats();

  const handleSubmitTest = (autoSubmitted = false) => {
    submitMutation.mutate({ autoSubmitted });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
        <p>Loading Exam Interface...</p>
      </div>
    );
  }

  if (isError || !test) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-red-400">
        <AlertCircle className="h-8 w-8 mb-4" />
        <p>Failed to load the test. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white font-sans overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-[#0B1220] px-6 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-white">{testTitle}</h2>
          <p className="text-[10px] text-slate-400">{test.totalQuestions} Questions • {test.totalMarks} Marks</p>
        </div>
        
        {/* Timer Box */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-2xl border border-slate-700/60 font-mono text-xl font-bold tracking-widest text-white shadow-inner">
          <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Answered: <span className="font-bold text-emerald-400">{currentStats.answered}</span> / {questions.length}
          </div>
          <Button 
            disabled={submitMutation.isPending}
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0F172A] font-bold text-xs px-5 py-2.5 h-9 rounded-xl shadow-md transition-all cursor-pointer border-none"
          >
            {submitMutation.isPending ? "SUBMITTING..." : "SUBMIT TEST"}
          </Button>
        </div>
      </header>

      {/* Sections Tab Bar */}
      <nav className="flex h-12 shrink-0 items-center bg-[#1E293B] border-b border-slate-800/60 px-6 gap-2">
        {subjects.map((subj) => {
          const isActive = activeSectionId === subj._id;
          const subjQuestions = questions.filter(q => (typeof q.subject === 'string' ? q.subject : q.subject._id) === subj._id);
          const answeredInSubj = subjQuestions.filter(q => {
            const hasAns = selectedAnswers[q._id] !== undefined && 
              (Array.isArray(selectedAnswers[q._id]) ? selectedAnswers[q._id].length > 0 : true);
            return hasAns;
          }).length;
          
          return (
            <button 
              key={subj._id}
              onClick={() => setSection(subj._id)}
              className={`flex items-center gap-2 h-full px-5 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                isActive 
                  ? "border-amber-500 text-amber-500 bg-slate-800/40" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {subj.name} 
              <Badge variant="outline" className={`ml-1 text-[10px] px-1.5 py-0.5 border-none rounded-full font-bold ${isActive ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                {answeredInSubj}/{subjQuestions.length}
              </Badge>
            </button>
          )
        })}
      </nav>

      {/* Exam Body Layout */}
      <div className="flex flex-1 min-h-0 bg-slate-950">
        
        {/* Left Side: Question Area */}
        <ScrollArea className="flex-1 flex flex-col min-w-0 p-6">
          <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full space-y-6 pb-24">
            
            {/* Question Card */}
            {activeQuestion ? (
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
                
                {/* Question Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/60 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-950 border border-indigo-500/30 text-indigo-400 font-black text-base">
                      Q {currentIndex + 1}
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {typeof activeQuestion.topic !== 'string' ? (activeQuestion.topic as any)?.title || 'TOPIC' : 'TOPIC'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                          {activeQuestion.difficulty}
                        </Badge>
                        <Badge variant="outline" className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                          {activeQuestion.questionType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="py-8 text-slate-200 text-lg font-medium leading-relaxed flex-1 select-text">
                  <p className="whitespace-pre-line">{activeQuestion.questionText}</p>
                  {activeQuestion.questionImage && (
                    <img src={activeQuestion.questionImage} alt="Question Diagram" className="mt-6 max-h-64 rounded-xl border border-slate-700 mx-auto" />
                  )}
                </div>

                {/* Options Grid / Integer Input */}
                <div className="space-y-3 shrink-0 mt-4">
                  {(activeQuestion.questionType === "single" || activeQuestion.questionType === "multiple") && activeQuestion.options ? (
                    activeQuestion.options.map((option, idx) => {
                      const optionLetters = ["A", "B", "C", "D", "E", "F"];
                      const isSelected = activeQuestion.questionType === "multiple" 
                        ? (Array.isArray(selectedAnswers[activeQuestion._id]) && selectedAnswers[activeQuestion._id].includes(idx))
                        : (Array.isArray(selectedAnswers[activeQuestion._id]) && selectedAnswers[activeQuestion._id][0] === idx);
                        
                      return (
                        <button 
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border font-medium transition-all duration-150 cursor-pointer ${
                            isSelected 
                              ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                              : "bg-slate-950/50 hover:bg-slate-850 border-slate-800 text-slate-300"
                          }`}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold border transition-colors ${
                            isSelected 
                              ? "bg-amber-500 border-amber-500 text-slate-950" 
                              : "bg-slate-900 border-slate-700 text-slate-400"
                          }`}>
                            {optionLetters[idx]}
                          </div>
                          <span className="text-base">{option}</span>
                        </button>
                      );
                    })
                  ) : activeQuestion.questionType === "integer" ? (
                    <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
                      <label className="block text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                        Enter your numerical answer:
                      </label>
                      <input 
                        type="number"
                        step="any"
                        value={selectedAnswers[activeQuestion._id] !== undefined ? selectedAnswers[activeQuestion._id] : ""}
                        onChange={(e) => handleIntegerInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white rounded-xl p-4 text-xl font-mono outline-none transition-all"
                        placeholder="e.g. 42.5"
                      />
                    </div>
                  ) : null}
                </div>

              </div>
            ) : null}

            {/* Bottom Actions Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800/60 rounded-2xl shrink-0 mt-6">
              <div className="flex items-center gap-2">
                <Button 
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  variant="outline"
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button 
                  onClick={handleClear}
                  variant="ghost"
                  className="bg-slate-850 hover:bg-slate-805 text-slate-300 hover:text-white font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Clear
                </Button>
                <Button 
                  onClick={handleMarkAndNext}
                  className="bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-purple-800/40 transition-all cursor-pointer"
                >
                  Mark & Next
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleSkip}
                  className="bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-amber-950/40 transition-all cursor-pointer"
                >
                  Skip →
                </Button>
                <Button 
                  onClick={handleSaveAndNext}
                  className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0F172A] font-extrabold text-xs py-3.5 px-6 h-11 rounded-xl shadow-md border-none transition-all cursor-pointer"
                >
                  Save & Next →
                </Button>
              </div>
            </div>

          </div>
        </ScrollArea>

        {/* Right Side: Question Palette Sidebar */}
        <aside className="w-80 border-l border-slate-800 bg-[#0B1220] flex flex-col justify-between p-6 overflow-y-auto shrink-0 select-none">
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Palette</h3>
              
              {/* Palette Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-4 text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-slate-950 border border-slate-800"></span>
                  <span>Current question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-emerald-500 border border-emerald-500"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-amber-500 border border-amber-500"></span>
                  <span>Skipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-purple-500 border border-purple-500 relative">
                    <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                  </span>
                  <span>Marked for review</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <span className="h-4 w-4 rounded bg-slate-800 border border-slate-700"></span>
                  <span>Not visited</span>
                </div>
              </div>
            </div>

            {/* Grid Sections */}
            <div className="space-y-5">
              {subjects.map((subj) => {
                const subjQuestions = questions.filter(q => (typeof q.subject === 'string' ? q.subject : q.subject._id) === subj._id);
                const answeredInSubj = subjQuestions.filter(q => {
                  const hasAns = selectedAnswers[q._id] !== undefined && 
                    (Array.isArray(selectedAnswers[q._id]) ? selectedAnswers[q._id].length > 0 : true);
                  return hasAns;
                }).length;

                return (
                  <div key={subj._id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{subj.name}</span>
                      <Badge variant="secondary" className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border-none">
                        {answeredInSubj}/{subjQuestions.length} answered
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {subjQuestions.map((q) => {
                        const actualIdx = questions.findIndex(globalQ => globalQ._id === q._id);
                        const qId = q._id;
                        const status = questionStatuses[qId] || "not_visited";
                        const isCurrent = currentIndex === actualIdx;
                        
                        let bgClass = "bg-slate-800 border-slate-700 text-slate-400";
                        if (isCurrent) bgClass = "bg-slate-950 border-amber-500 text-amber-500 ring-1 ring-amber-500";
                        else if (status === "answered") bgClass = "bg-emerald-500 border-emerald-500 text-white font-bold";
                        else if (status === "marked") bgClass = "bg-purple-500 border-purple-500 text-white font-bold";
                        else if (status === "skipped") bgClass = "bg-amber-500 border-amber-500 text-white font-bold";

                        return (
                          <button 
                            key={qId} 
                            onClick={() => {
                              setCurrentIndex(actualIdx);
                              setActiveSectionId(subj._id);
                            }}
                            className={`h-9 rounded-xl border flex items-center justify-center text-xs font-semibold relative transition-all duration-150 cursor-pointer ${bgClass}`}
                          >
                            {actualIdx + 1}
                            {status === "marked" && (
                              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Summary Footer */}
          <div className="border-t border-slate-800/80 pt-4 mt-6 text-slate-400 text-xs font-semibold space-y-1.5">
            <div className="flex justify-between">
              <span>Answered</span>
              <span className="text-white">{currentStats.answered}</span>
            </div>
            <div className="flex justify-between">
              <span>Skipped</span>
              <span className="text-white">{currentStats.skipped}</span>
            </div>
            <div className="flex justify-between">
              <span>Marked for review</span>
              <span className="text-white">{currentStats.marked}</span>
            </div>
            <div className="flex justify-between">
              <span>Not attempted</span>
              <span className="text-white">{currentStats.notAttempted}</span>
            </div>
          </div>

        </aside>

      </div>

      {/* Submit Test Dialog Overlay */}
      {isSubmitModalOpen && (
        <SubmitModal 
          stats={currentStats}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={() => handleSubmitTest()}
        />
      )}

    </div>
  );
}
