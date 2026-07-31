"use client";

import { useQuery } from "@tanstack/react-query";
import { userSubjectApi } from "@/lib/api/user/subject";
import { BookOpen, Search, AlertCircle, ArrowLeft, PlayCircle, FileText, HelpCircle, ChevronRight } from "lucide-react";
import { useState, use } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubjectChaptersPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: subjectData, isLoading: isSubjectLoading } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: () => userSubjectApi.getSubjectById(subjectId),
  });

  const { data: chaptersData, isLoading: isChaptersLoading, isError, error } = useQuery({
    queryKey: ["chapters", subjectId, searchTerm],
    queryFn: () => userSubjectApi.getChaptersBySubject(subjectId, searchTerm),
  });

  const subject = subjectData?.data;
  const chapters = chaptersData?.data || [];
  
  const isLoading = isSubjectLoading || isChaptersLoading;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-900 -ml-3">
          <Link href="/subjects">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Subjects
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="h-10 w-48 bg-slate-200" />
          ) : (
            <>
              <div 
                className="p-2 rounded-lg bg-slate-100 flex items-center justify-center"
                style={{ color: subject?.colorTheme || "#3b82f6" }}
              >
                <BookOpen className="h-6 w-6" />
              </div>
              {subject?.name}
            </>
          )}
        </h1>
        <p className="text-slate-500">
          Explore all chapters and topics under this subject.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search chapters by name or unit..."
          className="pl-10 bg-white border-slate-200 shadow-sm h-12 text-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl bg-slate-200/50" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-900 bg-red-950/50 text-red-200">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-semibold">Error</h4>
            <p className="text-sm opacity-90 mt-1">
              Failed to load chapters. {error?.message || "Please try again later."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && chapters.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl bg-slate-50">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-900">No Chapters Found</h3>
          <p className="text-slate-500">
            {searchTerm ? `No chapters match "${searchTerm}".` : "No chapters have been added to this subject yet."}
          </p>
        </div>
      )}

      {!isLoading && !isError && chapters.length > 0 && (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Link key={chapter._id} href={`/chapters/${chapter._id}`} className="block">
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-slate-300 group cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div 
                      className="w-2 transition-colors duration-300 rounded-l-xl group-hover:bg-blue-500"
                      style={{ backgroundColor: subject?.colorTheme || "#e2e8f0" }}
                    />
                    <div className="flex-1 p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 text-sm font-medium text-slate-500">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600">
                              Unit {chapter.unitOrder}
                            </span>
                            <span>•</span>
                            <span className="uppercase tracking-wide">{chapter.unitName}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            <span className="text-slate-400 mr-2 font-normal">Ch {chapter.chapterNumber.toString().padStart(2, '0')}</span>
                            {chapter.title}
                          </h3>
                          {chapter.subtitle && (
                            <p className="text-slate-500 text-sm mt-1">
                              {chapter.subtitle}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <PlayCircle className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{chapter.videosCount || 0}</span> Videos
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <FileText className="h-4 w-4 text-green-500" />
                              <span className="font-medium">{chapter.notesCount || 0}</span> Notes
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <HelpCircle className="h-4 w-4 text-orange-500" />
                              <span className="font-medium">{chapter.questionsCount || 0}</span> Questions
                            </div>
                          </div>
                        </div>
                        
                        <div className="hidden sm:flex items-center justify-center p-3">
                          <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
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
