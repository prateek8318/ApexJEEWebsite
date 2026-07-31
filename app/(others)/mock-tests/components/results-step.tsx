"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { 
  Trophy, 
  Award, 
  CheckCircle, 
  XCircle, 
  Home, 
  BarChart3,
  Percent,
  Clock
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Progress } from "@components/ui/progress";
import { TestAttempt } from "@/types/user-api";

interface ResultsStepProps {
  testTitle: string;
  results: TestAttempt;
  onBackToDashboard: () => void;
}

export default function ResultsStep({ testTitle, results, onBackToDashboard }: ResultsStepProps) {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener("resize", handleResize);
      
      const timer = setTimeout(() => setShowConfetti(false), 7000);
      
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timer);
      };
    }
  }, []);

  const overall = results.overallAnalysis;
  if (!overall) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        <div className="text-center">
          <p className="mb-4">Analysis data not found.</p>
          <Button onClick={onBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 text-foreground relative overflow-hidden">
      {showConfetti && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      <div className="mx-auto max-w-4xl space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-300">
        
        {/* Success Header Card */}
        <div className="rounded-3xl bg-[#0F172A] p-8 text-white shadow-xl text-center relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Test Submitted Successfully!</span>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
              Congratulations on completing {testTitle}!
            </h1>
            <p className="mt-2 text-slate-400 text-xs md:text-sm max-w-md">
              Your test response has been compiled. Review your metrics and performance analysis below.
            </p>
          </div>
        </div>

        {/* Scorecard Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Score */}
          <Card className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-center gap-4 hover:scale-[1.01] transition-transform">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Your Score</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-foreground">{overall.marksObtained}</span>
                <span className="text-muted-foreground text-xs font-bold">/ {overall.maxMarks}</span>
              </div>
            </div>
          </Card>

          {/* Accuracy */}
          <Card className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-center gap-4 hover:scale-[1.01] transition-transform">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Accuracy</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-foreground">{Math.round(overall.accuracy)}%</span>
              </div>
            </div>
          </Card>

          {/* Correct */}
          <Card className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-center gap-4 hover:scale-[1.01] transition-transform">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Correct</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-indigo-650">{overall.correct} Qs</span>
              </div>
            </div>
          </Card>

          {/* Wrong */}
          <Card className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-center gap-4 hover:scale-[1.01] transition-transform">
            <div className="p-3 bg-red-50 rounded-xl text-red-500">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Incorrect</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-red-550">{overall.incorrect} Qs</span>
              </div>
            </div>
          </Card>

        </div>

        {/* Detailed Breakdown Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Question Distribution */}
          <Card className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Response Summary</span>
              {results.timeTaken && (
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Time: {formatTime(results.timeTaken)}</span>
              )}
            </h3>
            
            <div className="space-y-4">
              
              {/* Answered Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-650 text-slate-600">Attempted</span>
                  <span className="text-foreground font-bold">{overall.attempted} / {overall.totalQuestions}</span>
                </div>
                <Progress value={(overall.attempted / (overall.totalQuestions || 1)) * 100} className="h-2.5 bg-slate-100" />
              </div>

              {/* Correct Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600">Correct Answers</span>
                  <span className="text-emerald-700 font-bold">{overall.correct} / {overall.attempted}</span>
                </div>
                <Progress value={(overall.correct / (overall.attempted || 1)) * 100} className="h-2.5 bg-slate-100 [&>div]:bg-emerald-500" />
              </div>

              {/* Skipped Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-650 text-slate-600">Skipped (Visited)</span>
                  <span className="text-foreground font-bold">{overall.skipped} / {overall.totalQuestions}</span>
                </div>
                <Progress value={(overall.skipped / (overall.totalQuestions || 1)) * 100} className="h-2.5 bg-slate-100 [&>div]:bg-amber-500" />
              </div>

              {/* Not Attempted Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-650 text-slate-600">Unanswered (Not Visited)</span>
                  <span className="text-foreground font-bold">{overall.unanswered} / {overall.totalQuestions}</span>
                </div>
                <Progress value={(overall.unanswered / (overall.totalQuestions || 1)) * 100} className="h-2.5 bg-slate-100" />
              </div>

            </div>
          </Card>

          {/* Sectional Performance */}
          <Card className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4" /> Sectional Breakdown
            </h3>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {results.subjectWiseAnalysis?.map((subjAnalysis: any) => (
                <div key={subjAnalysis.subject?._id || subjAnalysis.subject} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase">{(subjAnalysis.subject as any)?.name || 'Subject'}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{subjAnalysis.totalQuestions} Questions</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-600">{subjAnalysis.correct} Correct</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Accuracy: {Math.round(subjAnalysis.accuracy || 0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!results.subjectWiseAnalysis || results.subjectWiseAnalysis.length === 0) && (
                <div className="text-center text-sm text-slate-400 py-4">No sectional breakdown available.</div>
              )}
            </div>
          </Card>

        </div>

        {/* Back Button Action */}
        <div className="flex justify-center pt-2">
          <Button 
            onClick={onBackToDashboard}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0F172A] font-extrabold text-sm py-6 px-10 rounded-2xl shadow-lg hover:shadow-amber-500/20 transition-all border-none cursor-pointer"
          >
            <Home className="h-4 w-4 fill-slate-950" /> Back to Mock Dashboard
          </Button>
        </div>

      </div>
    </div>
  );
}
