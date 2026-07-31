"use client";


import { 
  Trophy, 
  BookOpen, 
  Clock, 
  BarChart2, 
  Play, 
  Award,
  CheckCircle2
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Progress } from "@components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { userTestApi } from "@/lib/api/user/test";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStepProps {
  onStartTest: (testId: string, testTitle: string) => void;
}

export default function DashboardStep({ onStartTest }: DashboardStepProps) {
  const stats = [
    { label: "TESTS TAKEN", value: "9", icon: BookOpen },
    { label: "TESTS REMAINING", value: "6", icon: Clock },
    { label: "AVG SCORE", value: "166", icon: BarChart2 },
    { label: "BEST SCORE", value: "214", icon: Award },
    { label: "BEST RANK", value: "#3,821", icon: Trophy, highlight: true }
  ];

  const testsHistory = [
    { name: "Mock Test JEE Main #1", date: "14 Feb 2026", phy: 76, mat: 62, total: 138, rank: "#7,820" },
    { name: "Mock Test JEE Main #2", date: "21 Feb 2026", phy: 80, mat: 65, total: 145, rank: "#7,400" },
    { name: "Mock Test JEE Main #3", date: "1 Mar 2026", phy: 82, mat: 67, total: 149, rank: "#7,100" },
    { name: "Mock Test JEE Main #4", date: "7 Mar 2026", phy: 87, mat: 71, total: 158, rank: "#6,620" },
  ];


  const { data: testsData, isLoading } = useQuery({
    queryKey: ["available-mock-tests"],
    queryFn: () => userTestApi.getAllTests({ limit: 20 }),
  });

  const availableTests = testsData?.data || [];

  const dynamicMainTests = availableTests.filter((t) => t.examTag?.toLowerCase().includes("main"));
  const dynamicAdvTests = availableTests.filter((t) => t.examTag?.toLowerCase().includes("advance"));
  const otherTests = availableTests.filter(
    (t) => !t.examTag?.toLowerCase().includes("main") && !t.examTag?.toLowerCase().includes("advance")
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 text-foreground">
            <div className="w-full space-y-8">
        
        {/* Top Header Card */}
        <div className="rounded-3xl bg-[#0F172A] p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                IIT JEE PREPARATION • APEXJEE
              </span>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
                Mock Tests & <span className="text-amber-400 font-serif italic">Full-Length Exams</span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm md:text-base">
                JEE Main & Advanced pattern • Timed tests • Instant score & All-India ranking
              </p>
            </div>
            <div className="text-slate-400 text-xs md:text-sm md:text-right">
              Score trend (tests taken)
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] ${
                    stat.highlight 
                      ? "bg-gradient-to-br from-indigo-900 to-indigo-950 border-indigo-500/30 text-white shadow-lg shadow-indigo-950/50" 
                      : "bg-[#1E293B]/60 backdrop-blur-sm border-slate-700/50 text-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {stat.label}
                    </span>
                    <Icon className={`h-4 w-4 ${stat.highlight ? "text-amber-400" : "text-slate-400"}`} />
                  </div>
                  <div className="mt-3">
                    <span className={`text-2xl md:text-3xl font-extrabold ${stat.highlight ? "text-amber-400" : "text-white"}`}>
                      {stat.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Tests Taken So Far */}
          <Card className="lg:col-span-7 bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-card-foreground">Tests Taken So Far</h2>
                  <p className="text-xs text-muted-foreground">9 of 15 tests completed</p>
                </div>
              </div>
              <Badge variant="secondary" className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 hover:bg-emerald-50">
                9 / 15
              </Badge>
            </div>

            <div className="mt-4">
              <Progress value={60} className="h-2 bg-slate-100" />
            </div>

            {/* History Table */}
            <div className="mt-6 overflow-x-auto flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%] text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Test Name</TableHead>
                    <TableHead className="text-center text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Phy</TableHead>
                    <TableHead className="text-center text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Mat</TableHead>
                    <TableHead className="text-center text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Total</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testsHistory.map((test, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/80 transition-colors group">
                      <TableCell className="py-4 font-semibold text-slate-700 text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-amber-400 group-hover:scale-110 transition-transform"></span>
                          <div>
                            <div className="font-semibold text-card-foreground text-sm">{test.name}</div>
                            <div className="text-[10px] text-muted-foreground font-medium">{test.date}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center font-medium text-muted-foreground text-sm">{test.phy}</TableCell>
                      <TableCell className="py-4 text-center font-medium text-muted-foreground text-sm">{test.mat}</TableCell>
                      <TableCell className="py-4 text-center font-bold text-red-500 text-sm">{test.total}</TableCell>
                      <TableCell className="py-4 text-right font-bold text-card-foreground text-sm">{test.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Right Column: Available Tests */}
          <Card className="lg:col-span-5 bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500">
                  <Play className="h-5 w-5 fill-indigo-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-card-foreground">Available Tests</h2>
                  <p className="text-xs text-muted-foreground">{availableTests.length} tests available to take</p>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                {availableTests.length} Remaining
              </Badge>
            </div>

            {/* Test Categories */}
            <div className="mt-6 space-y-6 flex-1 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin">
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl bg-slate-100" />
                  ))}
                </div>
              )}

              {!isLoading && availableTests.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No tests are currently available.
                </div>
              )}

              {/* JEE MAIN */}
              {dynamicMainTests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">JEE MAIN</span>
                  </div>
                  <div className="space-y-3">
                    {dynamicMainTests.map((test, idx) => (
                      <div 
                        key={test._id} 
                        className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 font-bold text-orange-500 text-sm flex-shrink-0">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm leading-tight">{test.title}</div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <span>{test.totalQuestions} Qs</span>
                              <span>•</span>
                              <span>{test.totalMarks} Marks</span>
                              <span>•</span>
                              <span>{test.durationMins} Mins</span>
                              {test.negativeMarking && (
                                <>
                                  <span>•</span>
                                  <span className="text-red-400">Negative Marking</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => onStartTest(test._id, test.title)}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 h-9 px-4 rounded-xl shadow-sm hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
                        >
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JEE ADVANCED */}
              {dynamicAdvTests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 mt-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">JEE ADVANCED</span>
                  </div>
                  <div className="space-y-3">
                    {dynamicAdvTests.map((test, idx) => (
                      <div 
                        key={test._id} 
                        className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-500 text-sm flex-shrink-0">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm leading-tight">{test.title}</div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <span>{test.totalQuestions} Qs</span>
                              <span>•</span>
                              <span>{test.totalMarks} Marks</span>
                              <span>•</span>
                              <span>{test.durationMins} Mins</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => onStartTest(test._id, test.title)}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 h-9 px-4 rounded-xl shadow-sm hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
                        >
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OTHER TESTS */}
              {otherTests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 mt-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">OTHER TESTS</span>
                  </div>
                  <div className="space-y-3">
                    {otherTests.map((test, idx) => (
                      <div 
                        key={test._id} 
                        className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 font-bold text-slate-600 text-sm flex-shrink-0">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm leading-tight">{test.title}</div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <span>{test.totalQuestions} Qs</span>
                              <span>•</span>
                              <span>{test.totalMarks} Marks</span>
                              <span>•</span>
                              <span>{test.durationMins} Mins</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => onStartTest(test._id, test.title)}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 h-9 px-4 rounded-xl shadow-sm hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
                        >
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
