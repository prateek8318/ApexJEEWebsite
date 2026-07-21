"use client";

import { useState } from "react";
import { 
  ChevronLeft
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";

interface InstructionsStepProps {
  testTitle: string;
  onBack: () => void;
  onBeginTest: () => void;
}

export default function InstructionsStep({ testTitle, onBack, onBeginTest }: InstructionsStepProps) {
  const [agreed, setAgreed] = useState(false);

  const infoBadges = [
    "3 hours",
    "20 Questions",
    "300 Marks",
    "JEE Main Pattern",
    "-1 per wrong answer"
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 text-foreground">
      <Card className="mx-auto max-w-4xl bg-card shadow-sm border border-border overflow-hidden rounded-3xl">
        
        {/* Back navigation & Header Banner */}
        <div className="bg-[#0F172A] p-6 text-white relative">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-slate-400 hover:text-white mb-4 text-xs font-bold transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{testTitle}</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Read all instructions before you begin</p>
          
          {/* Badge Grid */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            {infoBadges.map((badge, idx) => (
              <Badge key={idx} variant="outline" className="px-3 py-1.5 rounded-xl bg-slate-800/70 border-slate-700/50 text-[11px] font-medium text-slate-200 hover:bg-slate-800/70">
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Time Limit Section */}
        <div className="p-6 border-b border-border">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time Limit</span>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center justify-center bg-slate-900 text-yellow-400 font-mono text-2xl font-bold tracking-widest px-6 py-2.5 rounded-2xl border border-slate-800 shadow-inner">
              03:00:00
            </div>
            <div className="text-muted-foreground text-xs sm:max-w-md">
              <span className="font-semibold text-foreground">Timer starts when you click Begin Test.</span><br />
              Test auto-submits when the time reaches 00:00:00. Make sure to track your progress inside the exam dashboard.
            </div>
          </div>
        </div>

        {/* General Instructions */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-3">
              📝 General Instructions
            </h2>
            <ul className="space-y-2.5 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>This test contains <span className="font-semibold text-foreground">Physics</span> and <span className="font-semibold text-foreground">Mathematics</span>. Switch between sections using the tabs at the top of the test interface.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>Use the <span className="font-semibold text-foreground">Question Palette</span> on the right side of the screen to check the response status of all questions. Click any question number to jump directly to it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>Click <span className="font-semibold text-foreground">Save & Next</span> to save your answer and move forward. Click <span className="font-semibold text-foreground">Skip</span> to leave a question unanswered for now.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>Click <span className="font-semibold text-foreground">Mark & Next</span> to flag a question for later review — you can return to it before submitting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>Answers are saved automatically. Do not refresh or close the browser during the test.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>The test <span className="font-semibold text-foreground">auto-submits</span> when the timer reaches zero. You can also submit early anytime.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>Your <span className="font-semibold text-foreground">score and expected All-India rank</span> are shown immediately after submission.</span>
              </li>
            </ul>
          </div>

          {/* Marking Scheme */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-3">
              📊 Marking Scheme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-emerald-50 border-emerald-100 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-emerald-600">+4</div>
                <div className="text-xs font-bold text-emerald-800 mt-1 uppercase tracking-wider">Correct</div>
              </Card>
              <Card className="bg-red-50 border-red-100 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-red-500">-1</div>
                <div className="text-xs font-bold text-red-800 mt-1 uppercase tracking-wider">Wrong</div>
              </Card>
              <Card className="bg-slate-105 border-slate-200 rounded-2xl p-4 text-center bg-slate-100">
                <div className="text-2xl font-black text-slate-500">0</div>
                <div className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">Skipped</div>
              </Card>
            </div>
          </div>

          {/* Test Structure */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-3">
              📐 Test Structure
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Physics</span>
                <span className="text-slate-500">10 Questions: MCQ + Numerical types (4 marks each, -1 for wrong MCQ)</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Mathematics</span>
                <span className="text-slate-500">10 Questions: MCQ + Numerical types (4 marks each, -1 for wrong MCQ)</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="text-[10px] text-slate-400">
                Total: 20 Questions • 300 Marks (scaled)
              </div>
            </div>
          </div>
        </div>

        {/* Footer Panel */}
        <div className="bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <div className="flex items-center space-x-3 select-none cursor-pointer">
            <Checkbox 
              id="instructions-agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
              className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
            />
            <label htmlFor="instructions-agreement" className="text-sm font-semibold text-slate-600 cursor-pointer">
              I have read and understood all instructions
            </label>
          </div>

          <Button 
            disabled={!agreed}
            onClick={onBeginTest}
            className={`w-full sm:w-auto font-bold text-sm py-5 px-8 rounded-xl shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              agreed 
                ? "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-amber-500/20 active:scale-[0.98]" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Begin Test
          </Button>
        </div>

      </Card>
    </div>
  );
}
