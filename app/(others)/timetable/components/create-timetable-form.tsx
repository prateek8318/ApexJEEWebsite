"use client";

import { useMemo, useState } from "react";
import { ClipboardList, List, RefreshCw } from "lucide-react";
import { cn } from "@lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Label } from "@components/ui/label";
import {
  mathematicsTopics,
  physicsTopics,
  subjectOptions,
} from "@data/timetableTopics";
import TopicSelectionColumn from "./topic-selection-column";
import TimetableDateField from "./timetable-date-field";
import TimetableSection, { timetableStyles } from "./timetable-section";

type StudyMode = "regular" | "revision";

type Props = {
  onGenerate?: () => void;
};

const CreateTimetableForm = ({ onGenerate }: Props) => {
  const [studyMode, setStudyMode] = useState<StudyMode>("regular");
  const [startDate, setStartDate] = useState<Date>(new Date(2026, 4, 18));
  const [endDate, setEndDate] = useState<Date>(new Date(2026, 8, 14));
  const [subject, setSubject] = useState("physics-maths");
  const [selectedPhysics, setSelectedPhysics] = useState<Set<string>>(
    () => new Set(physicsTopics.map((topic) => topic.id)),
  );
  const [selectedMaths, setSelectedMaths] = useState<Set<string>>(
    () => new Set(mathematicsTopics.map((topic) => topic.id)),
  );

  const showPhysics = subject === "physics-maths" || subject === "physics";
  const showMaths = subject === "physics-maths" || subject === "mathematics";

  const gridCols = useMemo(() => {
    if (showPhysics && showMaths) return "lg:grid-cols-2";
    return "lg:grid-cols-1";
  }, [showPhysics, showMaths]);

  const toggleTopic = (
    topicId: string,
    checked: boolean,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(topicId);
      } else {
        next.delete(topicId);
      }
      return next;
    });
  };

  const toggleAll = (
    checked: boolean,
    topics: { id: string }[],
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
    setter(checked ? new Set(topics.map((topic) => topic.id)) : new Set());
  };

  return (
    <TimetableSection>
      <div className="flex items-start gap-3">
        <div className={timetableStyles.iconBox}>
          <ClipboardList className="size-[18px]" />
        </div>
        <div>
          <h1 className={timetableStyles.title}>Create Timetable</h1>
          <p className={timetableStyles.subtitle}>
            Set up a regular study or revision schedule — the system will automatically
            map content to dates.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setStudyMode("regular")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-colors",
            studyMode === "regular"
              ? "bg-[#e8940a] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          <List className="size-3.5" />
          Regular Study
        </button>
        <button
          type="button"
          onClick={() => setStudyMode("revision")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-colors",
            studyMode === "revision"
              ? "bg-[#e8940a] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          <RefreshCw className="size-3.5" />
          Revision
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <FormField label="Start Date" required>
          <TimetableDateField value={startDate} onChange={setStartDate} />
        </FormField>

        <FormField label="End Date" required>
          <TimetableDateField value={endDate} onChange={setEndDate} />
        </FormField>

        <FormField label="Subject" required>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-[13px] text-slate-700">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="mt-6">
        <h2 className={timetableStyles.sectionTitle}>Select Topics to Include:</h2>

        <div className={cn("mt-3 grid gap-3", gridCols)}>
          {showPhysics && (
            <TopicSelectionColumn
              title="Physics Topics"
              dotColor="bg-blue-500"
              topics={physicsTopics}
              selectedIds={selectedPhysics}
              onToggle={(id, checked) =>
                toggleTopic(id, checked, setSelectedPhysics)
              }
              onToggleAll={(checked) =>
                toggleAll(checked, physicsTopics, setSelectedPhysics)
              }
            />
          )}

          {showMaths && (
            <TopicSelectionColumn
              title="Mathematics Topics"
              dotColor="bg-amber-400"
              topics={mathematicsTopics}
              selectedIds={selectedMaths}
              onToggle={(id, checked) =>
                toggleTopic(id, checked, setSelectedMaths)
              }
              onToggleAll={(checked) =>
                toggleAll(checked, mathematicsTopics, setSelectedMaths)
              }
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onGenerate}
          className={timetableStyles.darkBtn}
        >
          Generate Timetable
        </button>
      </div>
    </TimetableSection>
  );
};

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

const FormField = ({ label, required, children }: FormFieldProps) => (
  <div className="space-y-1.5">
    <Label className={timetableStyles.label}>
      {label}
      {required && <span className="text-red-500"> *</span>}
    </Label>
    {children}
  </div>
);

export default CreateTimetableForm;
