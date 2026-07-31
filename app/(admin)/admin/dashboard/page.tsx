"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Layers, 
  Library, 
  Video, 
  FileText,
  TrendingUp,
  Activity,
  PlayCircle,
  ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { videosApi } from "@/lib/api/admin/videos";
import { notesApi } from "@/lib/api/admin/notes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { background } from "@/assets";

export default function AdminDashboardPage() {
  const { data: subjectsData } = useQuery({ queryKey: ["admin-subjects"], queryFn: () => subjectsApi.getAllSubjects() });
  const { data: chaptersData } = useQuery({ queryKey: ["admin-chapters"], queryFn: () => chaptersApi.getAllChapters() });
  const { data: topicsData } = useQuery({ queryKey: ["admin-topics"], queryFn: () => topicsApi.getAllTopics() });
  const { data: videosData } = useQuery({ queryKey: ["admin-videos"], queryFn: () => videosApi.getAllVideos() });
  const { data: notesData } = useQuery({ queryKey: ["admin-notes"], queryFn: () => notesApi.getAllNotes() });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    { 
      title: "Total Subjects", 
      value: subjectsData?.results || subjectsData?.data?.length || 0, 
      icon: <BookOpen className="h-6 w-6 text-indigo-500" />, 
      href: "/admin/subjects",
      bgColor: "bg-indigo-500/10",
      borderColor: "hover:border-indigo-500",
      textColor: "group-hover:text-indigo-600"
    },
    { 
      title: "Total Chapters", 
      value: chaptersData?.results || chaptersData?.data?.length || 0, 
      icon: <Layers className="h-6 w-6 text-emerald-500" />, 
      href: "/admin/chapters",
      bgColor: "bg-emerald-500/10",
      borderColor: "hover:border-emerald-500",
      textColor: "group-hover:text-emerald-600"
    },
    { 
      title: "Total Topics", 
      value: topicsData?.results || topicsData?.data?.length || 0, 
      icon: <Library className="h-6 w-6 text-amber-500" />, 
      href: "/admin/topics",
      bgColor: "bg-amber-500/10",
      borderColor: "hover:border-amber-500",
      textColor: "group-hover:text-amber-600"
    },
    { 
      title: "Total Videos", 
      value: videosData?.results || videosData?.data?.length || 0, 
      icon: <Video className="h-6 w-6 text-rose-500" />, 
      href: "/admin/videos",
      bgColor: "bg-rose-500/10",
      borderColor: "hover:border-rose-500",
      textColor: "group-hover:text-rose-600"
    },
    { 
      title: "Total Notes", 
      value: notesData?.results || notesData?.data?.length || 0, 
      icon: <FileText className="h-6 w-6 text-cyan-500" />, 
      href: "/admin/notes",
      bgColor: "bg-cyan-500/10",
      borderColor: "hover:border-cyan-500",
      textColor: "group-hover:text-cyan-600"
    },
  ];

  // Extract recent videos for the activity feed
  const recentVideos = (videosData?.data || [])
    .slice()
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-8 w-full px-4 sm:px-6 lg:px-8 pb-12 pt-4">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-8 sm:p-10 min-h-[220px] flex flex-col justify-center">
        
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={background} 
            alt="Dashboard Background" 
            fill 
            className="object-cover opacity-60 pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 flex flex-col gap-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md w-fit border border-white/10 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">System Online</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            {getGreeting()}, <span className="text-yellow-400">Admin!</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed drop-shadow">
            Monitor your platform's growth, manage content efficiently, and keep track of recent updates.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="block group">
            <Card className={`h-full transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl border-2 border-transparent ${stat.borderColor} cursor-pointer bg-white`}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} transition-transform group-hover:scale-110`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</div>
                    <div className={`text-sm font-medium text-slate-500 mt-1 transition-colors ${stat.textColor}`}>
                      {stat.title}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-2 shadow-md border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Recently Added Videos
              </CardTitle>
              <Link href="/admin/videos">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentVideos.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentVideos.map((video: any) => (
                  <div key={video._id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="h-5 w-5 text-rose-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{video.title}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {video.subject?.name} • {video.chapter?.title}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                  <Video className="h-6 w-6 text-slate-400" />
                </div>
                <p>No recent videos found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-1 shadow-md border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-3">
            <Link href="/admin/subjects">
              <Button className="w-full justify-start h-12 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border-none shadow-none font-semibold">
                <BookOpen className="h-5 w-5 mr-3" />
                Manage Subjects
              </Button>
            </Link>
            <Link href="/admin/chapters">
              <Button className="w-full justify-start h-12 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-none shadow-none font-semibold">
                <Layers className="h-5 w-5 mr-3" />
                Manage Chapters
              </Button>
            </Link>
            <Link href="/admin/topics">
              <Button className="w-full justify-start h-12 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-none shadow-none font-semibold">
                <Library className="h-5 w-5 mr-3" />
                Manage Topics
              </Button>
            </Link>
            <Link href="/admin/videos">
              <Button className="w-full justify-start h-12 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border-none shadow-none font-semibold">
                <Video className="h-5 w-5 mr-3" />
                Manage Videos
              </Button>
            </Link>
            <Link href="/admin/notes">
              <Button className="w-full justify-start h-12 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-800 border-none shadow-none font-semibold">
                <FileText className="h-5 w-5 mr-3" />
                Manage Notes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
