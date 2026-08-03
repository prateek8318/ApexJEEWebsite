"use client";

import { 
  Users, CalendarDays, Pencil, Clock, Search, Download 
} from "lucide-react";
import { cn } from "@/lib/utils";

const students = [
  { id: '1', name: 'Rahul Sharma', initial: 'R', bg: '#0B132B', city: 'Lucknow', plan: 'Quarterly', tt: 78, acc: 74, best: 214, taken: 14, risk: 'Medium' },
  { id: '2', name: 'Priya Mehta', initial: 'P', bg: '#3B82F6', city: 'Jaipur', plan: 'Yearly', tt: 91, acc: 84, best: 226, taken: 12, risk: 'Low' },
  { id: '3', name: 'Rahul Sharma', initial: 'R', bg: '#0B132B', city: 'Lucknow', plan: 'Quarterly', tt: 78, acc: 74, best: 214, taken: 14, risk: 'Medium' },
  { id: '4', name: 'Priya Mehta', initial: 'P', bg: '#3B82F6', city: 'Jaipur', plan: 'Yearly', tt: 91, acc: 84, best: 226, taken: 12, risk: 'Low' },
  { id: '5', name: 'Rahul Sharma', initial: 'R', bg: '#0B132B', city: 'Lucknow', plan: 'Quarterly', tt: 78, acc: 74, best: 214, taken: 14, risk: 'Medium' },
  { id: '6', name: 'Priya Mehta', initial: 'P', bg: '#3B82F6', city: 'Jaipur', plan: 'Yearly', tt: 91, acc: 84, best: 226, taken: 12, risk: 'Low' },
];

export default function StudentPerformance() {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-10">

      <div className="px-8 mt-8 max-w-[1400px] mx-auto space-y-6">
        
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Users size={20} />
              </div>
              <div className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                ↑ 23
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">847</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Total Students</p>
            <div className="mt-4 bg-slate-100 h-1.5 rounded-full w-full">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <CalendarDays size={20} />
              </div>
              <div className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                ↑ 6%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">68%</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Platform Avg. TT Adherence</p>
            <div className="mt-4 bg-slate-100 h-1.5 rounded-full w-full">
              <div className="bg-[#F5A623] h-1.5 rounded-full" style={{width: '68%'}}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Pencil size={20} />
              </div>
              <div className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                ↑ 4%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">74%</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Avg Practice Accuracy</p>
            <div className="mt-4 bg-slate-100 h-1.5 rounded-full w-full">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '74%'}}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <Clock size={20} />
              </div>
              <div className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                ↑ 18 pts
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">182</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Avg Mock Score / 300</p>
            <div className="mt-4 bg-slate-100 h-1.5 rounded-full w-full">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Search className="text-slate-400" size={18} />
              <h3 className="text-lg font-bold text-slate-800">Filter & Sort Students</h3>
            </div>
            <button className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1">
              ↺ Reset All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TIMETABLE ADHERENCE</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 appearance-none bg-transparent">
                <option>All (any adherence)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PRACTICE QUESTION ACCURACY</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 appearance-none bg-transparent">
                <option>All accuracy levels</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MOCK TEST PERFORMANCE</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 appearance-none bg-transparent">
                <option>All score ranges</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SUBSCRIPTION PLAN</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 appearance-none bg-transparent">
                <option>All plans</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RISK CATEGORY</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 appearance-none bg-transparent">
                <option>All students</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SORT BY</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 appearance-none bg-transparent">
                <option>Name (A—Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Header Controls */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-800">10</span> students</p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> Send Bulk Reminder
            </button>
            <button className="px-4 py-2 bg-[#0B132B] text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
              <Download size={16} /> Export List
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">STUDENT</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">CITY</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">PLAN</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider w-32">TT ADHERENCE</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider w-32">PRACTICE ACC.</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">BEST<br/>MOCK</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">MOCKS<br/>TAKEN</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">RISK</th>
                  <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{backgroundColor: student.bg}}>
                          {student.initial}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-700 block leading-tight">{student.name}</span>
                          <span className="text-[10px] text-emerald-500 font-medium">active</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-500">{student.city}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase",
                        student.plan === 'Quarterly' ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {student.plan}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", student.tt > 85 ? "bg-emerald-500" : "bg-[#F5A623]")} style={{width: `${student.tt}%`}}></div>
                        </div>
                        <span className={cn("text-xs font-bold w-7", student.tt > 85 ? "text-emerald-500" : "text-[#F5A623]")}>{student.tt}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", student.acc > 80 ? "bg-emerald-500" : "bg-orange-500")} style={{width: `${student.acc}%`}}></div>
                        </div>
                        <span className={cn("text-xs font-bold w-7", student.acc > 80 ? "text-emerald-500" : "text-orange-500")}>{student.acc}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-xs font-bold text-emerald-500">{student.best}</span>
                    </td>
                    <td className="py-4 text-center text-xs font-medium text-slate-600">{student.taken}</td>
                    <td className="py-4 text-center">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wide uppercase",
                        student.risk === 'Low' ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600"
                      )}>
                        {student.risk}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="px-3 py-1.5 bg-[#F5A623] hover:bg-orange-500 text-white rounded-md text-[10px] font-bold transition-colors">
                          Analytics
                        </button>
                        <button className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-md text-[10px] font-bold transition-colors">
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
