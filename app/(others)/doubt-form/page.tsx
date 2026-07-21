"use client";

import { Wrench} from "lucide-react";

export default function DoubtUnderProgress() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-4xl text-center space-y-6">

        {/* Simple Icon */}
        <div className="mx-auto h-16 w-16 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full flex items-center justify-center">
          <Wrench className="h-8 w-8" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Doubt Portal System Update
          </h1>

        </div>

        {/* Simple Loading Bar */}
        <div className="w-48 h-1.5 bg-muted mx-auto rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-primary rounded-full animate-pulse" />
        </div>

        {/* Action Buttons */}


      </div>
    </div>
  );
}