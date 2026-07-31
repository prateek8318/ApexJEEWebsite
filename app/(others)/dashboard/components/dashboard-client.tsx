"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Pencil, 
  Target, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  BarChart2,
  AlertCircle,
  Play,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import useSession from "@stores/session";

export default function DashboardClient() {
  const { session } = useSession();
  const [greetingInfo, setGreetingInfo] = useState({ dateStr: "", weekNum: 1, greetingMsg: "Good morning" });

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('en-US', options).toUpperCase();
    
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    
    const hour = now.getHours();
    let greetingMsg = "Good morning";
    if (hour >= 12 && hour < 17) {
      greetingMsg = "Good afternoon";
    } else if (hour >= 17) {
      greetingMsg = "Good evening";
    }
    
    setGreetingInfo({ dateStr, weekNum, greetingMsg });
  }, []);

  const userName = (session as any)?.name || "Student";

  return (
    <div className="flex flex-col w-full min-h-full bg-[#f4f6f9]">
      <div className="w-full bg-gradient-to-r from-[#070e1e] via-[#0b1731] to-[#0a1128] text-white px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-inner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        
        <div className="z-10 flex flex-col max-w-4xl">
          <span className="text-[#dfb15b] text-xs font-bold tracking-widest uppercase mb-2 animate-fade-in">
            {greetingInfo.dateStr || "LOADING DATE..."} • WEEK {greetingInfo.weekNum} OF 52
          </span>
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-3 text-slate-100">
            {greetingInfo.greetingMsg}, <span className="italic font-serif text-[#dfb15b] font-semibold">{userName}!</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed font-light">
            You have 4 videos and 40 practice questions scheduled for today. Your mock rank improved by 683 positions in the last test — keep this momentum going.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link 
              href="/timetable"
              className="bg-[#df9b15] hover:bg-[#c7870e] text-slate-900 font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm cursor-pointer"
            >
              <Calendar size={16} />
              View Today's Schedule
            </Link>
            <Link 
              href="/practice-questions"
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 text-slate-200 font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer"
            >
              <Pencil size={16} />
              Practice Questions
            </Link>
            <Link 
              href="/mock-tests"
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 text-slate-200 font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer"
            >
              <Target size={16} />
              Take Mock Test
            </Link>
          </div>
        </div>
        <div className="z-10 bg-[#0e1c33]/90 border-l-4 border-[#df9b15] rounded-r-xl p-5 w-full md:w-80 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-l-5 transition-all relative shrink-0">
          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs tracking-wider mb-2 uppercase">
            <Sparkles size={14} className="animate-pulse" />
            INSPIRATION
          </div>
          <p className="text-xl font-serif text-white tracking-wide italic mt-1 pl-1">
            "Work Hard"
          </p>
        </div>
      </div>
      <div className="flex-1 px-4 md:px-8 py-8 w-full max-w-full">
        <div className="w-full space-y-12">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-slate-200/80 rounded-lg shadow-sm flex items-center justify-center text-primary">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 font-serif">Performance Summary</h2>
                  <p className="text-xs text-slate-400 font-sans hidden sm:block">
                    Timetable • Practice • Mock Tests — quick overview
                  </p>
                </div>
              </div>
              
              <Link 
                href="/analytics" 
                className="flex items-center gap-1.5 text-xs font-bold text-[#b38f4d] hover:text-[#9e7a3a] transition-colors uppercase tracking-wider"
              >
                Full Analytics
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-slate-200">
                <div>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wider uppercase mb-6">
                    📅 TIMETABLE ADHERENCE
                  </span>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-slate-800 font-sans">43%</span>
                    <span className="text-xs text-slate-500 max-w-[100px] leading-tight">
                      of days targets met
                    </span>
                  </div>
                  
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-[#df9b15] rounded-full w-[43%]" />
                  </div>
                </div>

                <div>
                  <div className="flex gap-8 border-t border-slate-100 pt-4">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-bold text-base">55</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">days studied</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-bold text-base">36</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">targets met</span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-rose-500 bg-rose-50/50 border border-rose-100/50 p-2.5 rounded-lg mt-4 flex items-center gap-2 animate-pulse-subtle">
                    <AlertCircle size={14} className="shrink-0 text-rose-500" />
                    <span>Current backlog: <strong className="font-bold">3 videos & 10 Qs</strong></span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-slate-200">
                <div>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wider uppercase mb-6">
                    ✏️ PRACTICE QUESTIONS
                  </span>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative w-28 h-28 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#df9b15" />
                          </linearGradient>
                        </defs>
                        <circle 
                          className="text-slate-100" 
                          strokeWidth="8" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="38" 
                          cx="50" 
                          cy="50" 
                        />
                        <circle 
                          strokeWidth="8" 
                          strokeDasharray="238.76" 
                          strokeDashoffset={238.76 - (238.76 * 74) / 100} 
                          strokeLinecap="round" 
                          stroke="url(#accuracyGradient)" 
                          fill="transparent" 
                          r="38" 
                          cx="50" 
                          cy="50" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-slate-800 font-sans">74%</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">accuracy</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2.5">
                      <div className="flex justify-between items-baseline border-b border-slate-50 pb-1.5">
                        <span className="text-xs text-slate-500">Attempted</span>
                        <span className="font-bold text-slate-800 text-sm">1,084</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-slate-50 pb-1.5">
                        <span className="text-xs text-emerald-600 font-medium">✓ Correct</span>
                        <span className="font-bold text-emerald-600 text-sm">802</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-slate-50 pb-1.5">
                        <span className="text-xs text-rose-500 font-medium">✗ Wrong</span>
                        <span className="font-bold text-rose-500 text-sm">282</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs font-semibold border-t border-slate-100 pt-4 mt-auto">
                  <span className="text-blue-600 bg-blue-50/55 border border-blue-100/50 px-2.5 py-1 rounded-md">Physics: 76%</span>
                  <span className="text-[#df9b15] bg-amber-50/55 border border-amber-100/50 px-2.5 py-1 rounded-md">Maths: 71%</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-slate-200">
                <div>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
                    ⏱️ MOCK TEST PERFORMANCE
                  </span>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-emerald-600 font-serif">#3,821</span>
                    <span className="text-xs text-slate-500 leading-tight">
                      best rank achieved
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 font-medium mb-6">
                    9 tests taken - Latest: <strong className="text-slate-600">214/300</strong> • Avg: <strong className="text-slate-600">187/300</strong>
                  </p>
                </div>

                <div>
                  {/* Score Trend Bar Chart */}
                  <div className="flex items-end justify-between h-20 gap-1.5 px-2">
                    {[20, 32, 38, 48, 42, 58, 68, 62, 85].map((height, idx) => (
                      <div 
                        key={idx} 
                        style={{ height: `${height}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 hover:scale-x-105 ${
                          idx === 8 
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.3)]" 
                            : "bg-slate-200 hover:bg-slate-300"
                        }`}
                        title={`Mock Test ${idx + 1}: ${height}%`}
                      />
                    ))}
                  </div>
                  
                  <div className="text-[10px] text-slate-400 font-semibold mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                    <TrendingUp size={12} className="text-emerald-500 animate-bounce" />
                    <span>Score trend → of 9 mock tests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-slate-200/80 rounded-lg shadow-sm flex items-center justify-center text-primary">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 font-serif">Today's Timetable</h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Friday 17 May 2026 - Scheduled videos & practice questions
                  </p>
                </div>
              </div>
              
              <Link 
                href="/timetable" 
                className="flex items-center gap-1.5 text-xs font-bold text-[#b38f4d] hover:text-[#9e7a3a] transition-colors uppercase tracking-wider"
              >
                Full Timetable
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#0b1227] via-[#0f1936] to-[#0b1227] border border-slate-800/80 rounded-xl p-6 text-white mb-8 shadow-[0_12px_36px_rgba(0,0,0,0.1)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    Friday, 17 May 2026
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-slate-100 font-serif">Physics Topic 6</h3>
                    <h3 className="text-lg font-medium text-slate-100 font-serif">Maths Topic 5</h3>
                  </div>
                </div>
                <div className="md:border-l md:border-slate-800/60 md:pl-8">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                    VIDEOS
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-serif text-slate-100">6</span>
                      <span className="text-xs text-slate-500">/ 12</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-serif text-slate-100">7</span>
                      <span className="text-xs text-slate-500">/ 13</span>
                    </div>
                  </div>
                </div>
                <div className="md:border-l md:border-slate-800/60 md:pl-8">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                    PRACTICE QUESTIONS
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-serif text-slate-100">12</span>
                      <span className="text-xs text-slate-500">/ 32</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-serif text-slate-100">0</span>
                      <span className="text-xs text-slate-500">/ 45</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-800/60 mt-5 pt-4 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 bg-[#df9b15]/10 border border-[#df9b15]/20 text-[#df9b15] px-3 py-1 rounded-md text-xs font-semibold">
                  <span>⚡ Physics</span>
                  <span className="bg-[#df9b15]/20 px-1.5 py-0.5 rounded text-[10px] text-white">4 videos • 3 topics</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-md text-xs font-semibold">
                  <span>∑ Mathematics</span>
                  <span className="bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px] text-white">3 videos • 3 topics</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-bold text-slate-800 font-serif flex items-center gap-2">
                    🎬 Videos to Watch Today
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    4 videos
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          EM Induction — Faraday's Law & Lenz's Law
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">⏱ 38 min</span>
                          <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.2 rounded font-medium">lecture</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 shrink-0">Completed ✓</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 text-slate-450 rounded-lg flex items-center justify-center shrink-0">
                        <Play size={16} className="text-slate-500 pl-0.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          EM Induction — Self & Mutual Inductance
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">⏱ 42 min</span>
                          <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.2 rounded font-medium">lecture</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-500 shrink-0">In Progress</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-250 rounded-lg shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          Wave Optics — Interference: Young's DSE
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">⏱ 46 min</span>
                          <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.2 rounded font-medium">lecture</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-250 rounded-lg shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          Wave Optics — Diffraction & Polarisation
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">⏱ 34 min</span>
                          <span className="text-[10px] text-[#df9b15] bg-[#df9b15]/10 px-1.5 py-0.2 rounded font-medium">problem</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 mb-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                    ⚠️ BACKLOG FROM PREVIOUS DAYS (3)
                  </span>
                  <div className="flex-1 border-t border-dashed border-rose-200" />
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 border border-rose-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center shrink-0">
                        <AlertCircle size={18} className="animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          Alternating Currents — RLC Circuits <span className="text-slate-400 font-normal">(Backlog: Wed)</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">⏱ 40 min</span>
                          <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.2 rounded font-medium">lecture</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded uppercase shrink-0">
                      ⚠️ Backlog
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-rose-100/85 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-lg shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          Alternating Currents — Power Factor <span className="text-slate-400 font-normal">(Backlog: Wed)</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">⏱ 38 min</span>
                          <span className="text-[10px] text-[#df9b15] bg-[#df9b15]/10 px-1.5 py-0.2 rounded font-medium">revision</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded uppercase shrink-0">
                      ⚠️ Backlog
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-rose-100/85 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-lg shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          Ray Optics — Lens Maker's Equation <span className="text-slate-400 font-normal">(Backlog: Thu)</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">⏱ 35 min</span>
                          <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.2 rounded font-medium">lecture</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded uppercase shrink-0">
                      ⚠️ Backlog
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-slate-800 font-serif flex items-center gap-2">
                    ✏️ Practice Questions Today
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    120 questions
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 hover:border-slate-200 transition-all duration-300">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                      <h4 className="text-sm font-bold text-slate-700">EM Induction — Faraday's Law</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                        43% acc.
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                        TOTAL: 100 Qs
                      </span>
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2 mb-4">
                    {/* Done items 1 to 24 with green border */}
                    {Array.from({ length: 22 }, (_, i) => i + 1).map((n) => (
                      <div key={n} className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">
                        {n}
                      </div>
                    ))}
                    {/* Flagged item 23, 24, 25... */}
                    <div className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">23</div>
                    <div className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">24</div>
                    <div className="aspect-square border border-rose-400 text-rose-600 bg-rose-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold relative hover:scale-105 transition-all">
                      25 <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-rose-500" />
                    </div>
                    {/* Green borders 26 to 28 */}
                    <div className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">26</div>
                    <div className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">27</div>
                    <div className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">28</div>
                    {/* Flagged 29 */}
                    <div className="aspect-square border border-rose-400 text-rose-600 bg-rose-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold relative hover:scale-105 transition-all animate-pulse-subtle">
                      29 <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                    {/* Green borders 30 to 42 */}
                    {Array.from({ length: 13 }, (_, i) => i + 30).map((n) => (
                      <div key={n} className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">
                        {n}
                      </div>
                    ))}
                    {/* Solid dark grey background remaining 43 to 64 */}
                    {Array.from({ length: 22 }, (_, i) => i + 43).map((n) => (
                      <div key={n} className="aspect-square bg-slate-800 text-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">
                        {n}
                      </div>
                    ))}
                    {/* Faded items */}
                    <div className="aspect-square bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-bold">65</div>
                    <div className="aspect-square bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-bold">66</div>
                    <div className="aspect-square bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-bold">...</div>
                    <div className="aspect-square bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-bold">100</div>
                  </div>

                  {/* Legend */}
                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center gap-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="text-slate-800">● TODAY'S BATCH (Q41-Q80)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-emerald-400 bg-emerald-55" /> Done</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-800" /> Remaining</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-rose-400 bg-rose-55" /> Flagged</span>
                  </div>
                </div>

                {/* Topic Widget 2: Wave Optics - Interference */}
                <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 hover:border-slate-200 transition-all duration-300">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                      <h4 className="text-sm font-bold text-slate-700">Wave Optics — Interference</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                      TOTAL: 60 Qs
                    </span>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2 mb-4">
                    {/* Solid dark grey background 1 to 20 */}
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <div key={n} className="aspect-square bg-slate-800 text-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">
                        {n}
                      </div>
                    ))}
                    {/* Remaining 21 to 30 */}
                    {Array.from({ length: 10 }, (_, i) => i + 21).map((n) => (
                      <div key={n} className="aspect-square bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-bold">
                        {n}
                      </div>
                    ))}
                    <div className="aspect-square bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-bold">...</div>
                    <div className="aspect-square bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-bold">60</div>
                  </div>

                  {/* Legend */}
                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center gap-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="text-slate-800">● TODAY'S BATCH (Q1-Q30)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-800" /> Done</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-100" /> Remaining</span>
                  </div>
                </div>

                {/* Topic Widget 3: EM Induction - Inductance (Backlog) */}
                <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-l-4 border-l-rose-500 border border-slate-100/80 hover:border-slate-200 transition-all duration-300">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <h4 className="text-sm font-bold text-slate-700">EM Induction — Inductance (Backlog)</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded uppercase">
                        ⚠️ BACKLOG
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                        55% acc.
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                        TOTAL: 50 Qs
                      </span>
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2 mb-4">
                    {/* Green borders 1 to 18 */}
                    {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                      <div key={n} className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">
                        {n}
                      </div>
                    ))}
                    {/* Red border 19 */}
                    <div className="aspect-square border border-rose-400 text-rose-600 bg-rose-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold relative hover:scale-105 transition-all">
                      19 <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-rose-500" />
                    </div>
                    {/* Green border 20 */}
                    <div className="aspect-square border border-emerald-400 text-emerald-600 bg-emerald-50/10 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">20</div>
                    {/* Remaining 21 to 50 solid dark grey */}
                    {Array.from({ length: 30 }, (_, i) => i + 21).map((n) => (
                      <div key={n} className="aspect-square bg-slate-800 text-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold hover:scale-105 transition-all">
                        {n}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center gap-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="text-slate-800">● TODAY'S BATCH (Q21-Q50)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-emerald-400 bg-emerald-50" /> Done</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-800" /> Remaining</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-rose-400 bg-rose-55" /> Flagged</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
