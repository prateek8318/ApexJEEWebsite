"use client";

import { useState } from "react";
import { format } from "date-fns";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Clock,
  Pencil,
  Sigma,
  Video,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Checkbox } from "@components/ui/checkbox";
import {
  dailyTasks,
  dailyTasksDate,
} from "@data/timetableDailyTasks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TimetableDayDialog = ({ open, onOpenChange }: Props) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [practiceDone, setPracticeDone] = useState<Record<string, boolean>>({});

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const dateLabel = format(dailyTasksDate, "EEEE, d MMMM yyyy");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          className={cn(
            "fixed top-3 right-3 bottom-3 z-50 flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-2xl outline-none",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-8",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-8",
          )}
        >
          <div className="relative shrink-0 bg-[#0b1221] px-6 pb-5 pt-6">
            <DialogPrimitive.Close
              className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>

            <DialogPrimitive.Title className="pr-8 font-serif text-[1.6rem] leading-tight font-bold text-white">
              {dateLabel}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1.5 text-[13px] text-slate-400">
              Click tasks to mark as complete
            </DialogPrimitive.Description>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
            {dailyTasks.map((subject) => (
              <div key={subject.id} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  {subject.id === "physics" ? (
                    <Zap className="size-4 text-amber-500" />
                  ) : (
                    <Sigma className="size-4 text-blue-600" />
                  )}
                  <h3 className="text-[15px] font-bold text-slate-900">
                    {subject.label}
                  </h3>
                </div>

                <div className="mt-3 space-y-3">
                  {subject.lectures.map((lecture) => (
                    <LectureTaskCard
                      key={lecture.id}
                      taskId={lecture.id}
                      title={`${lecture.title} — Video ${lecture.videoIndex} / ${lecture.videoTotal}`}
                      duration={lecture.duration}
                      completed={completedTasks.has(lecture.id)}
                      onToggle={() => toggleTask(lecture.id)}
                    />
                  ))}

                  {subject.practice.map((practice) => (
                    <PracticeTaskCard
                      key={practice.id}
                      practice={practice}
                      done={practiceDone[practice.id] ?? false}
                      onDoneChange={(checked) =>
                        setPracticeDone((prev) => ({
                          ...prev,
                          [practice.id]: checked,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

type LectureTaskCardProps = {
  taskId: string;
  title: string;
  duration: string;
  completed: boolean;
  onToggle: () => void;
};

const LectureTaskCard = ({
  title,
  duration,
  completed,
  onToggle,
}: LectureTaskCardProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      "flex w-full items-start gap-3 rounded-xl bg-slate-50 p-3.5 text-left transition-colors hover:bg-slate-100/80",
      completed && "opacity-60",
    )}
  >
    <Checkbox
      checked={completed}
      className="mt-0.5 size-4 rounded border-slate-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
      onCheckedChange={onToggle}
      onClick={(event) => event.stopPropagation()}
    />

    <div className="min-w-0 flex-1">
      <div className="flex items-start gap-2">
        <Video className="mt-0.5 size-3.5 shrink-0 text-slate-500" />
        <p
          className={cn(
            "text-[13px] font-medium text-slate-800",
            completed && "line-through",
          )}
        >
          {title}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2 pl-5">
        <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
          Lecture
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="size-3" />
          {duration}
        </span>
      </div>
    </div>
  </button>
);

type PracticeTaskCardProps = {
  practice: {
    topic: string;
    batchLabel: string;
    batchStart: number;
    batchEnd: number;
    totalQuestions: number;
  };
  done: boolean;
  onDoneChange: (checked: boolean) => void;
};

const PracticeTaskCard = ({ practice, done, onDoneChange }: PracticeTaskCardProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Pencil className="size-3.5 text-slate-500" />
        <span className="text-[13px] font-semibold text-slate-800">
          {practice.topic}
        </span>
      </div>
      <span className="text-[10px] font-medium text-slate-400">
        {practice.batchLabel}
      </span>
    </div>

    <div className="mt-3 grid grid-cols-10 gap-1">
      {Array.from({ length: practice.totalQuestions }, (_, index) => {
        const number = index + 1;
        const isInBatch =
          number >= practice.batchStart && number <= practice.batchEnd;

        return (
          <div
            key={number}
            className={cn(
              "flex aspect-square items-center justify-center rounded text-[9px] font-medium",
              isInBatch
                ? "bg-[#111827] text-white"
                : "border border-slate-200 bg-white text-slate-400",
            )}
          >
            {number}
          </div>
        );
      })}
    </div>

    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-[#111827]" />
        <span className="text-[11px] text-slate-500">Today&apos;s batch</span>
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          checked={done}
          onCheckedChange={(checked) => onDoneChange(checked === true)}
          className="size-3.5 rounded border-slate-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
        />
        <span className="text-[11px] font-medium text-slate-600">Done</span>
      </label>
    </div>
  </div>
);

export default TimetableDayDialog;
