"use client";

import React, { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { userTestAttemptApi } from "@/lib/api/user/test-attempt";
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PracticeReviewPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { data: reviewData, isLoading, isError } = useQuery({
    queryKey: ["practiceReview", unwrappedParams.attemptId],
    queryFn: () => userTestAttemptApi.getPracticeAttemptReview(unwrappedParams.attemptId),
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-slate-500 font-medium flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
          Loading your review...
        </div>
      </div>
    );
  }

  if (isError || !reviewData?.data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-red-500 font-medium">Failed to load review.</div>
      </div>
    );
  }

  const {
    overallAnalysis,
    questionWiseReview,
    timeTaken,
  } = reviewData.data;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <button
          onClick={() => router.push("/practice-questions")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Practice
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Practice Session Review</h1>
            <p className="text-sm text-slate-500 mt-1">
              Review your performance and explanations
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {Math.floor((timeTaken || 0) / 60)}m {(timeTaken || 0) % 60}s
            </span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 flex gap-8 divide-x divide-slate-100">
          <div className="flex-1 text-center">
            <div className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wider">Accuracy</div>
            <div className="text-3xl font-black text-amber-500">{overallAnalysis?.accuracy || 0}%</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wider">Correct</div>
            <div className="text-3xl font-black text-emerald-500">{overallAnalysis?.correct || 0}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wider">Incorrect</div>
            <div className="text-3xl font-black text-red-500">{overallAnalysis?.incorrect || 0}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wider">Skipped</div>
            <div className="text-3xl font-black text-slate-400">{overallAnalysis?.skipped || 0}</div>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            Detailed Analysis
          </h2>
          {questionWiseReview?.map((q: any, i: number) => {
            const isCorrect = q.status === "correct";
            const isSkipped = q.status === "skipped" || q.status === "unanswered";
            
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className={`px-5 py-3 flex items-center justify-between border-b ${
                  isCorrect ? "bg-emerald-50 border-emerald-100" :
                  isSkipped ? "bg-slate-50 border-slate-200" : "bg-red-50 border-red-100"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700">Q{i + 1}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 uppercase">
                      {q.question.questionType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCorrect && <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-4 h-4"/> CORRECT</span>}
                    {!isCorrect && !isSkipped && <span className="flex items-center gap-1.5 text-xs font-bold text-red-600"><XCircle className="w-4 h-4"/> INCORRECT</span>}
                    {isSkipped && <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><AlertCircle className="w-4 h-4"/> SKIPPED</span>}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-slate-800 text-base mb-6 font-medium whitespace-pre-line">
                    {q.question.questionText}
                    {q.question.questionImage && (
                      <img src={q.question.questionImage} alt="Question" className="mt-4 max-h-48 rounded-lg border border-slate-200" />
                    )}
                  </div>

                  {q.question.questionType !== "integer" ? (
                    <div className="space-y-3 mb-6">
                      {q.question.options?.map((opt: string, optIdx: number) => {
                        const isChosen = q.chosenOptions.includes(optIdx);
                        const isRightAnswer = q.correctOptions.includes(optIdx);
                        
                        let optClass = "border-slate-200 bg-white text-slate-700";
                        if (isRightAnswer) optClass = "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-500";
                        else if (isChosen && !isRightAnswer) optClass = "border-red-500 bg-red-50 text-red-800 font-semibold ring-1 ring-red-500";
                        
                        return (
                          <div key={optIdx} className={`flex items-center gap-3 p-3 rounded-xl border ${optClass}`}>
                            <div className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-xs font-bold ${
                              isRightAnswer ? "bg-emerald-500 text-white" : 
                              isChosen ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <div className="text-sm">{opt}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mb-6 flex gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex-1">
                        <div className="text-xs text-slate-500 font-semibold mb-1 uppercase">Your Answer</div>
                        <div className={`text-lg font-mono font-bold ${isCorrect ? "text-emerald-600" : isSkipped ? "text-slate-500" : "text-red-600"}`}>
                          {q.chosenIntegerAnswer ?? "—"}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex-1">
                        <div className="text-xs text-emerald-600 font-semibold mb-1 uppercase">Correct Answer</div>
                        <div className="text-lg font-mono font-bold text-emerald-700">
                          {q.correctIntegerAnswer ?? "—"}
                        </div>
                      </div>
                    </div>
                  )}

                  {q.question.explanation && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                      <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Explanation</div>
                      <div className="text-sm text-slate-700 whitespace-pre-line">
                        {q.question.explanation}
                      </div>
                      {q.question.explanationImage && (
                        <img src={q.question.explanationImage} alt="Explanation" className="mt-3 max-h-48 rounded-lg border border-amber-200" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
