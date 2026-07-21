"use client";


import { BookOpen,Clock } from "lucide-react";

export default function NotesUnderProgress() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-4xl text-center space-y-6">

        {/* Simple Icon */}
        <div className="mx-auto h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <BookOpen className="h-8 w-8" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Lecture Notes Compiling
          </h1>

        </div>

        {/* Text Status Badge */}
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 px-3 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5" /> Processing Material...
        </div>


      </div>
    </div>
  );
}