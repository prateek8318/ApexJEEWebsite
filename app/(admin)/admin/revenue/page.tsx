"use client";

import { useState } from "react";
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from "recharts";
import { 
  ArrowUpRight, IndianRupee, Users, 
  CreditCard, Search, Download,
  BookOpen, Video, FileText, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api/admin/users";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { videosApi } from "@/lib/api/admin/videos";
import { notesApi } from "@/lib/api/admin/notes";
import { chaptersApi } from "@/lib/api/admin/chapters";

const barData = [
  { name: 'DEC', previous: 55, current: 68 },
  { name: 'JAN', previous: 65, current: 92 },
  { name: 'FEB', previous: 75, current: 105 },
  { name: 'MAR', previous: 70, current: 98 },
  { name: 'APR', previous: 85, current: 114 },
  { name: 'MAY', previous: 0, current: 124 },
];

const pieData = [
  { name: 'Quarterly', value: 298, percentage: 47, color: '#F5A623' },
  { name: 'Monthly', value: 212, percentage: 40, color: '#3B82F6' },
  { name: 'Yearly', value: 124, percentage: 13, color: '#10B981' },
];

const transactions = [
  { id: 'TXN2048', initial: 'R', name: 'Rahul Sharma', plan: 'QUARTERLY', amount: '₹499', date: '2 Feb 2026', method: 'UPI', status: 'SUCCESS' },
  { id: 'TXN2046', initial: 'S', name: 'Sneha Kumar', plan: 'QUARTERLY', amount: '₹499', date: '10 Jan 2026', method: 'UPI', status: 'SUCCESS' },
  { id: 'TXN2047', initial: 'P', name: 'Priya Mehta', plan: 'YEARLY', amount: '₹1,499', date: '15 Jan 2026', method: 'Card', status: 'SUCCESS' },
  { id: 'TXN2045', initial: 'T', name: 'Tanvi Reddy', plan: 'YEARLY', amount: '₹1,499', date: '8 Jan 2026', method: 'NetBkg', status: 'SUCCESS' },
  { id: 'TXN2044', initial: 'A', name: 'Ananya Das', plan: 'YEARLY', amount: '₹1,499', date: '5 Feb 2026', method: 'UPI', status: 'SUCCESS' },
  { id: 'TXN2043', initial: 'R', name: 'Rohit Verma', plan: 'MONTHLY', amount: '₹199', date: '1 Dec 2025', method: 'Card', status: 'REFUNDED' },
  { id: 'TXN2042', initial: 'A', name: 'Arjun Patel', plan: 'MONTHLY', amount: '₹199', date: '1 Mar 2026', method: 'UPI', status: 'SUCCESS' },
  { id: 'TXN2041', initial: 'K', name: 'Kavya Nair', plan: 'QUARTERLY', amount: '₹499', date: '20 Feb 2026', method: 'UPI', status: 'SUCCESS' },
];

export default function RevenueDashboard() {
  const [dateFilter, setDateFilter] = useState("3 Months");
  const [txnFilter, setTxnFilter] = useState("All Plans");

  const { data: usersData } = useQuery({ queryKey: ["admin-users"], queryFn: () => userApi.getAllUsers() });
  const { data: subjectsData } = useQuery({ queryKey: ["admin-subjects"], queryFn: () => subjectsApi.getAllSubjects() });
  const { data: videosData } = useQuery({ queryKey: ["admin-videos"], queryFn: () => videosApi.getAllVideos() });
  const { data: notesData } = useQuery({ queryKey: ["admin-notes"], queryFn: () => notesApi.getAllNotes() });
  const { data: chaptersData } = useQuery({ queryKey: ["admin-chapters"], queryFn: () => chaptersApi.getAllChapters() });

  const totalUsers = usersData?.results || usersData?.data?.length || 0;
  const totalSubjects = subjectsData?.results || subjectsData?.data?.length || 0;
  const totalVideos = videosData?.results || videosData?.data?.length || 0;
  const totalNotes = notesData?.results || notesData?.data?.length || 0;
  const totalChapters = chaptersData?.results || chaptersData?.data?.length || 0;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-10">

      <div className="px-8 mt-8 max-w-[1400px] mx-auto space-y-6">
        
        {/* Date Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
            {['7 Days', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'].map((f) => (
              <button 
                key={f}
                onClick={() => setDateFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                  dateFilter === f ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-lg px-4 py-2">
              <span className="font-medium">Custom:</span>
              <span>01 - 02 - 2026</span>
              <span className="mx-1">to</span>
              <span>17 - 05 - 2026</span>
            </div>
            <button className="px-5 py-2 bg-[#0B132B] text-white rounded-lg text-sm font-medium hover:bg-slate-800">
              Apply
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <IndianRupee size={20} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
                <ArrowUpRight size={14} /> 18%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">₹6.21L</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Total Revenue (3 Months)</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
              <span className="text-emerald-500 font-bold flex items-center"><ArrowUpRight size={12}/> ₹98k</span> vs previous period
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <CreditCard size={20} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
                <ArrowUpRight size={14} /> 12%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">634</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Active Subscriptions</p>
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-slate-500">74.9% of 847 registered</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <Users size={20} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
                <ArrowUpRight size={14} /> 8%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">₹1,468</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Avg Revenue / Student</p>
            <p className="text-xs text-slate-500 mt-4">23 new students this month</p>
          </div>

          {/* Card 4 (Dynamic Users) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Users size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{totalUsers}</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Total Registered Students</p>
            <p className="text-xs text-slate-500 mt-4">Across all subscription plans</p>
          </div>
        </div>

        {/* Dynamic Content Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800">{totalSubjects}</h4>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Subjects</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800">{totalChapters}</h4>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Chapters</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Video size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800">{totalVideos}</h4>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Videos</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800">{totalNotes}</h4>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Notes</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Bar Chart Container */}
          <div className="col-span-2 bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Revenue Trend</h3>
                <p className="text-sm text-slate-500">Monthly revenue for the selected period</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#F5A623]"></div> Current
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-200"></div> Previous
                </div>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={0}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="previous" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="current" fill="#F5A623" radius={[4, 4, 0, 0]} barSize={40}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.current === 124 ? '#F5A623' : '#F1F5F9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Custom timeline bar underneath */}
            <div className="w-full h-2 rounded-full mt-4 flex overflow-hidden">
              <div className="h-full bg-[#F5A623]" style={{width: '47%'}}></div>
              <div className="h-full bg-blue-500" style={{width: '40%'}}></div>
              <div className="h-full bg-emerald-500" style={{width: '13%'}}></div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-3 px-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#F5A623]"></div> Quarterly 47%</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Monthly 40%</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Yearly 13%</div>
            </div>
          </div>

          {/* Pie Chart Container */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50"></div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Plan Breakup</h3>
                <p className="text-xs text-slate-500">Revenue distribution by plan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-slate-800">634</span>
                  <span className="text-[10px] font-bold text-slate-500">Student</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {pieData.map((plan) => (
                  <div key={plan.name}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: plan.color}}></div>
                        <span className="text-slate-700">{plan.name}</span>
                      </div>
                      <span style={{color: plan.color}}>{plan.percentage}%</span>
                    </div>
                    <p className="text-[9px] text-slate-400 ml-3.5">{plan.value} students • ₹{plan.value * 400}/mo</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
               {pieData.map((plan) => (
                  <div key={`list-${plan.name}`} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: plan.color}}></div>
                      <span className="font-semibold text-slate-600">{plan.name} Plan</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400">{plan.value} active</span>
                      <span className="font-bold" style={{color: plan.color}}>{plan.percentage}%</span>
                    </div>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Transaction Log */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                📋
              </div>
              <h3 className="text-lg font-bold text-slate-800">Transaction Log</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name, plan..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64"
                />
              </div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <Download size={16} /> CSV
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {['All Plans', 'Monthly', 'Quarterly', 'Yearly'].map((t) => (
              <button 
                key={t}
                onClick={() => setTxnFilter(t)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-colors border",
                  txnFilter === t ? "bg-[#F5A623] text-white border-[#F5A623]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                {t}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button className="px-4 py-1.5 rounded-full text-xs font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 flex items-center gap-1 hover:bg-emerald-100">
              ✓ Successful
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-bold text-red-500 border border-red-200 bg-red-50 flex items-center gap-1 hover:bg-red-100">
              ✗ Refunded
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">TXN ID</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">STUDENT</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">PLAN</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">AMOUNT</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">DATE</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">METHOD</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-4 text-xs font-medium text-slate-400">{txn.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center font-bold text-xs">
                          {txn.initial}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{txn.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase",
                        txn.plan === 'QUARTERLY' ? "bg-yellow-100 text-yellow-700" :
                        txn.plan === 'YEARLY' ? "bg-emerald-100 text-emerald-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {txn.plan}
                      </span>
                    </td>
                    <td className="py-4 text-center text-sm font-medium text-slate-600">{txn.amount}</td>
                    <td className="py-4 text-center text-xs font-medium text-slate-500">{txn.date}</td>
                    <td className="py-4 text-center text-xs font-medium text-slate-600">{txn.method}</td>
                    <td className="py-4 text-right pr-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wide uppercase",
                        txn.status === 'SUCCESS' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                      )}>
                        {txn.status}
                      </span>
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
