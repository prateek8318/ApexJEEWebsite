"use client";

import { useQuery } from "@tanstack/react-query";
import { userSubjectApi } from "@/lib/api/user/subject";
import { Search, AlertCircle, BookOpen } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subjects", searchTerm],
    queryFn: () => userSubjectApi.getAllSubjects(searchTerm),
  });

  const subjects = data?.data || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-500" />
          Subjects
        </h1>
        <p className="text-slate-500">
          Explore and manage all the subjects available for your preparation.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search subjects by name or code..."
          className="pl-10 bg-white border-slate-200 shadow-sm h-12 text-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-slate-200/50" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-900 bg-red-950/50 text-red-200">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-semibold">Error</h4>
            <p className="text-sm opacity-90 mt-1">
              Failed to load subjects. {error?.message || "Please try again later."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && subjects.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl bg-slate-50">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-900">No Subjects Found</h3>
          <p className="text-slate-500">
            {searchTerm ? `No subjects match "${searchTerm}".` : "No subjects are available right now."}
          </p>
        </div>
      )}

      {!isLoading && !isError && subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Link key={subject._id} href={`/subjects/${subject._id}`}>
              <Card 
                className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-slate-300 overflow-hidden group cursor-pointer h-full"
              >
                <div 
                  className="h-2 w-full transition-all duration-300"
                  style={{ backgroundColor: subject.colorTheme || "#3b82f6" }}
                />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {subject.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {subject.code}
                        </span>
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-xl bg-slate-50 flex items-center justify-center"
                      style={{ color: subject.colorTheme || "#3b82f6" }}
                    >
                      <BookOpen className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
