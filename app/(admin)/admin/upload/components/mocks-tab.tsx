"use client";

import React, { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testsApi } from "@/lib/api/admin/tests";
import { toast } from "sonner";
import { Test as TestType } from "@/types/admin-api";
import Link from "next/link";

export function MocksTab() {
  // Form States
  const [title, setTitle] = useState("");
  const [testCategory, setTestCategory] = useState("full");
  const [mode, setMode] = useState("mock");
  const [durationMins, setDurationMins] = useState("180");
  const [totalMarks, setTotalMarks] = useState("300");
  const [totalQuestions, setTotalQuestions] = useState("75");
  const [examTag, setExamTag] = useState("");
  
  // New test fields
  const [instructions, setInstructions] = useState("");
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const queryClient = useQueryClient();

  const { data: testsData, isLoading: isLoadingTests } = useQuery({
    queryKey: ["admin-tests", "", "all", "all"],
    queryFn: () => testsApi.getAllTests({ search: "", mode: "all", testCategory: "all" }),
  });

  const testsList = testsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: Partial<TestType>) => testsApi.createTest(data),
    onSuccess: () => {
      toast.success("Mock test created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
      // Reset form
      setTitle(""); setExamTag(""); setInstructions(""); setScheduledAt("");
      setNegativeMarking(false); setIsLive(false); setIsActive(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create mock test");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testsApi.deleteTest(id),
    onSuccess: () => {
      toast.success("Mock test deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
  });

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please provide a title");
      return;
    }
    
    let formattedInstructions = instructions;
    if (formattedInstructions) {
      try {
        JSON.parse(formattedInstructions);
      } catch {
        const lines = formattedInstructions.split('\n').filter(line => line.trim() !== '');
        formattedInstructions = JSON.stringify(lines);
      }
    }
    
    const payload: Partial<TestType> = {
      title,
      testCategory: testCategory as any,
      mode: mode as any,
      durationMins: Number(durationMins),
      totalMarks: Number(totalMarks),
      totalQuestions: Number(totalQuestions),
      examTag,
      instructions: formattedInstructions,
      negativeMarking,
      isLive,
      isActive
    };

    if (scheduledAt) {
      payload.scheduledAt = new Date(scheduledAt).toISOString();
    }

    createMutation.mutate(payload);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Create Mock Test</h2>
        </div>

        <form onSubmit={handleCreateTest} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Mock Test Title <span className="text-red-500">*</span></label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. JEE Advanced Full Mock #12" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Test Category <span className="text-red-500">*</span></label>
              <select value={testCategory} onChange={(e) => setTestCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                <option value="full">Full Syllabus</option>
                <option value="subject">Subject</option>
                <option value="chapter">Chapter</option>
                <option value="topic">Topic</option>
                <option value="pyq">PYQ</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Test Mode <span className="text-red-500">*</span></label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                <option value="mock">Mock Test</option>
                <option value="practice">Practice</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Total Duration (mins)</label>
              <input value={durationMins} onChange={(e) => setDurationMins(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Total Marks</label>
              <input value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Total Questions</label>
              <input value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Exam Tag</label>
              <input value={examTag} onChange={(e) => setExamTag(e.target.value)} type="text" placeholder="e.g. JEE Main" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600">Instructions (Plain text or JSON)</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Test instructions..." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Scheduled At (Optional)</label>
              <input value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} type="datetime-local" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={negativeMarking} onChange={(e) => setNegativeMarking(e.target.checked)} />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Negative Marks</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isLive} onChange={(e) => setIsLive(e.target.checked)} />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Live Test</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Active Status</span>
                <span className="text-[10px] text-slate-500">Make test visible</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => { setTitle(""); setExamTag(""); setInstructions(""); setScheduledAt(""); setNegativeMarking(false); setIsLive(false); setIsActive(true); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">
                Clear
              </button>
              <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-[#F5A623] text-white font-bold text-sm rounded-lg hover:bg-orange-500 flex items-center gap-2 disabled:opacity-50">
                <Plus size={16} /> {createMutation.isPending ? "Creating..." : "Create Mock Test"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Scheduled & Past Mock Tests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center w-[40px]">S.NO.</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">TITLE</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">CATEGORY</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">QUESTIONS</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">DURATION</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingTests ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500 text-sm">Loading tests...</td></tr>
              ) : testsList.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500 text-sm">No tests found</td></tr>
              ) : (
                testsList.map((test: TestType, index: number) => (
                  <tr key={test._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-4 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 pr-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 leading-tight block max-w-sm">{test.title}</span>
                        {test.examTag && <span className="text-[10px] text-slate-400 mt-1">{test.examTag}</span>}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2 py-1 rounded text-[9px] font-bold bg-blue-50 text-blue-500 uppercase">
                        {test.testCategory}
                      </span>
                    </td>
                    <td className="py-4 text-center text-xs font-medium text-slate-600">{test.totalQuestions || 0}</td>
                    <td className="py-4 text-center text-xs font-medium text-slate-600">{test.durationMins || 0} mins</td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/tests/${test._id}`}>
                          <button className="px-3 py-1.5 border border-indigo-100 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded text-[10px] font-bold transition-colors">Manage Qs</button>
                        </Link>
                        <button onClick={() => {if(confirm("Delete test?")) deleteMutation.mutate(test._id);}} className="px-3 py-1.5 border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 rounded text-[10px] font-bold transition-colors">Del</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
