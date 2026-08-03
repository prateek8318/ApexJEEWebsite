"use client";

import { useState } from "react";
import { 
  Megaphone, Users, UserRound, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const postedNotifications = [
  { id: '1', title: 'New Mock Test added — JEE Advanced Pattern', type: 'General', priority: 'Important', target: 'All Students', date: '14 May 2026', views: '904' },
  { id: '2', title: 'Faculty Note to Rahul Sharma', type: 'Personal', priority: 'Normal', target: '1 Rahul Sharma', date: '12 May 2026', views: '1' },
  { id: '3', title: 'Reminder: Low TT Adherence Students', type: 'Segment', priority: 'Important', target: '< 50% TT Adherence students', date: '10 May 2026', views: '120' },
  { id: '4', title: 'Platform maintenance — 20 May 2-3 AM', type: 'General', priority: 'Urgent', target: 'All Students', date: '9 May 2026', views: '847' },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-10">

      <div className="px-8 mt-8 max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        
        {/* Left Panel: Post New Notification */}
        <div className="col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm self-start">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Megaphone size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Post New Notification</h2>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('general')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2",
                activeTab === 'general' ? "border-[#0B132B] shadow-sm ring-1 ring-[#0B132B]" : "border-slate-200 text-slate-400 hover:border-slate-300"
              )}
            >
              <Megaphone size={20} className={activeTab === 'general' ? "text-[#0B132B]" : "text-slate-400"} />
              <div>
                <h3 className={cn("text-xs font-bold", activeTab === 'general' ? "text-[#0B132B]" : "text-slate-500")}>General Broadcast</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">To all students</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('segment')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2",
                activeTab === 'segment' ? "border-[#0B132B] shadow-sm ring-1 ring-[#0B132B]" : "border-slate-200 text-slate-400 hover:border-slate-300"
              )}
            >
              <Users size={20} className={activeTab === 'segment' ? "text-[#0B132B]" : "text-slate-400"} />
              <div>
                <h3 className={cn("text-xs font-bold", activeTab === 'segment' ? "text-[#0B132B]" : "text-slate-500")}>Segment Broadcast</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Filter by plan, progress etc.</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('personal')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2",
                activeTab === 'personal' ? "border-[#0B132B] shadow-sm ring-1 ring-[#0B132B]" : "border-slate-200 text-slate-400 hover:border-slate-300"
              )}
            >
              <UserRound size={20} className={activeTab === 'personal' ? "text-[#0B132B]" : "text-slate-400"} />
              <div>
                <h3 className={cn("text-xs font-bold", activeTab === 'personal' ? "text-[#0B132B]" : "text-slate-500")}>Personal Message</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Faculty note to student</p>
              </div>
            </button>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Notification Title <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. New Mock Test added — JEE Advanced Pattern" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Message <span className="text-red-500">*</span></label>
              <textarea rows={5} placeholder="Write your message here..." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600">Priority Level</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none bg-white">
                  <option>Normal</option>
                  <option>Important</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600">Schedule (leave blank to send now)</label>
                <input type="date" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none text-slate-400" />
              </div>
            </div>

            <div className="pt-4">
              <button type="button" className="w-full py-3 bg-[#F5A623] text-white font-bold text-sm rounded-lg hover:bg-orange-500 flex items-center justify-center gap-2 shadow-sm">
                <Megaphone size={16} fill="currentColor" /> Post Notification
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel: Posted Notifications */}
        <div className="col-span-5 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm self-start">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Posted Notifications</h2>
            </div>
            <select className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-500 border border-slate-200 outline-none">
              <option>All Types</option>
            </select>
          </div>

          <div className="space-y-4">
            {postedNotifications.map((notif) => (
              <div key={notif.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors flex gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2 pr-4">{notif.title}</h3>
                    <button className="text-[10px] font-bold text-red-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                      Del
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                      notif.type === 'General' ? "bg-blue-50 text-blue-500" :
                      notif.type === 'Personal' ? "bg-purple-50 text-purple-500" :
                      "bg-emerald-50 text-emerald-600"
                    )}>
                      {notif.type}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                      notif.priority === 'Urgent' ? "bg-red-50 text-red-500" :
                      notif.priority === 'Important' ? "bg-orange-50 text-orange-500" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {notif.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1"><Users size={10}/> {notif.target}</span>
                    <span>•</span>
                    <span>{notif.date}</span>
                    <span>•</span>
                    <span>{notif.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
