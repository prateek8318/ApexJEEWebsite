"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@lib/utils";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
};

const TimetableDateField = ({ value, onChange, className }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-700 transition-colors hover:bg-slate-50",
            className,
          )}
        >
          <span>{format(value, "dd-MM-yyyy")}</span>
          <CalendarDays className="size-4 text-slate-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default TimetableDateField;
