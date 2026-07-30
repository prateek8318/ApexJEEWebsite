"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Layers, 
  Library, 
  Video, 
  FileText 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { chaptersApi } from "@/lib/api/admin/chapters";
import { topicsApi } from "@/lib/api/admin/topics";
import { videosApi } from "@/lib/api/admin/videos";
import { notesApi } from "@/lib/api/admin/notes";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: subjectsData } = useQuery({ queryKey: ["admin-subjects"], queryFn: () => subjectsApi.getAllSubjects() });
  const { data: chaptersData } = useQuery({ queryKey: ["admin-chapters"], queryFn: () => chaptersApi.getAllChapters() });
  const { data: topicsData } = useQuery({ queryKey: ["admin-topics"], queryFn: () => topicsApi.getAllTopics() });
  const { data: videosData } = useQuery({ queryKey: ["admin-videos"], queryFn: () => videosApi.getAllVideos() });
  const { data: notesData } = useQuery({ queryKey: ["admin-notes"], queryFn: () => notesApi.getAllNotes() });

  const stats = [
    { title: "Total Subjects", value: subjectsData?.results || subjectsData?.data?.length || 0, icon: <BookOpen className="h-6 w-6 text-primary" />, href: "/admin/subjects" },
    { title: "Total Chapters", value: chaptersData?.results || chaptersData?.data?.length || 0, icon: <Layers className="h-6 w-6 text-primary" />, href: "/admin/chapters" },
    { title: "Total Topics", value: topicsData?.results || topicsData?.data?.length || 0, icon: <Library className="h-6 w-6 text-primary" />, href: "/admin/topics" },
    { title: "Total Videos", value: videosData?.results || videosData?.data?.length || 0, icon: <Video className="h-6 w-6 text-primary" />, href: "/admin/videos" },
    { title: "Total Notes", value: notesData?.results || notesData?.data?.length || 0, icon: <FileText className="h-6 w-6 text-primary" />, href: "/admin/notes" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of the platform's content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  {stat.title}
                </CardTitle>
                <div className="group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-primary transition-colors">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Activity feed will be displayed here.</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Quick action buttons will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
