"use client";

import { 
  MessageSquareText, CheckCircle2, Hourglass, Zap, Search, Check, Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";

const discussions = [
  { id: '1', name: 'Rahul Sharma', initial: 'R', bg: '#0B132B', subject: 'Physics', topic: 'EM Induction', time: '12m ago', question: 'Why does a diamagnetic substance move from a stronger magnetic field to a weaker region?', replies: 2, status: 'PENDING' },
  { id: '2', name: 'Arjun Patel', initial: 'A', bg: '#3B82F6', subject: 'Maths', topic: 'Integration', time: '1h ago', question: 'How do I decide whether to use substitution or integration by parts for a given integral?', replies: 0, status: 'PENDING' },
  { id: '3', name: 'Karan Singh', initial: 'K', bg: '#4F46E5', subject: 'Physics', topic: 'Magnetic Effects', time: '3h ago', question: 'In Lenz\'s law, how do we determine the exact direction of the induced current in the coil?', replies: 0, status: 'PENDING', isUrgent: true },
  { id: '4', name: 'Tanvi Reddy', initial: 'T', bg: '#F5A623', subject: 'Maths', topic: 'Diff. Equations', time: '5h ago', question: 'What is the condition for a differential equation to be considered \'Exact\'? How to test?', replies: 0, status: 'PENDING', isUrgent: true },
];

export default function DiscussionForum() {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-10">

      <div className="px-8 mt-8 max-w-[1400px] mx-auto space-y-6">
        
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <MessageSquareText size={20} />
              </div>
              <div className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                ↑ 24
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">1,847</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Total Doubts Posted</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">1,673</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Resolved (Users)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Hourglass size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">12</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Unanswered</p>
            <p className="text-[10px] text-slate-400 mt-2">Active in the last 24 hours</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Zap size={20} />
              </div>
              <div className="text-orange-500 text-xs font-bold flex items-center gap-0.5">
                ↓ 12m
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">3.2h</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Avg Response Time</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by student name or question..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
          </div>
          
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-[#F5A623] text-white">
              All (1,847)
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center gap-2">
              Pending <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[10px]">12</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center gap-2">
              ⚠️ Urgent {"<"}24h <span className="bg-red-100 text-red-500 px-1.5 py-0.5 rounded text-[10px]">3</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50">
              Answered
            </button>
          </div>

          <div className="ml-auto">
            <select className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-slate-600 border border-slate-200 outline-none">
              <option>All Subjects</option>
            </select>
          </div>
        </div>

        {/* Post Feed */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {discussions.map((post, i) => (
            <div key={post.id} className={cn("p-6", i !== discussions.length - 1 && "border-b border-slate-100")}>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm" style={{backgroundColor: post.bg}}>
                    {post.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-800">{post.name}</span>
                      <span className="text-slate-300">—</span>
                      <span className="text-slate-500 font-medium">{post.subject}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{post.topic}</span>
                      {post.isUrgent && (
                        <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded-full ml-2 flex items-center gap-1">
                          ⚠️ 24h
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Posted {post.time}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-500 tracking-wider">PENDING</span>
              </div>

              <div className="pl-13 ml-3 mb-6">
                <p className="text-sm text-slate-700 font-medium leading-relaxed max-w-4xl">
                  {post.question}
                </p>
              </div>

              <div className="flex items-center justify-between pl-13 ml-3">
                <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                  <MessageSquareText size={14} /> {post.replies} replies • {post.subject}
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2 bg-[#F5A623] hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2">
                    <Pencil size={12} /> Write Reply
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-2">
                    <Check size={14} /> Resolve
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-red-400 hover:bg-red-50 hover:border-red-200 font-bold text-xs rounded-lg transition-colors">
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
