"use client";

import { Checkbox } from "@components/ui/checkbox";
import { cn } from "@lib/utils";
import type { TimetableTopic } from "@data/timetableTopics";

type Props = {
  title: string;
  dotColor: string;
  topics: TimetableTopic[];
  selectedIds: Set<string>;
  onToggle: (topicId: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
};

const TopicSelectionColumn = ({
  title,
  dotColor,
  topics,
  selectedIds,
  onToggle,
  onToggleAll,
}: Props) => {
  const allSelected = topics.length > 0 && topics.every((topic) => selectedIds.has(topic.id));
  const someSelected = topics.some((topic) => selectedIds.has(topic.id));

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-3.5 py-2.5">
        <span className={cn("size-2 rounded-full", dotColor)} />
        <h3 className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
          {title}
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        <label className="flex cursor-pointer items-center justify-between px-3.5 py-2.5 hover:bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              className="size-3.5 rounded border-blue-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
            />
            <span className="text-[13px] font-medium text-slate-700">Select All</span>
          </div>
        </label>

        {topics.map((topic) => (
          <label
            key={topic.id}
            className="flex cursor-pointer items-center justify-between px-3.5 py-2.5 hover:bg-slate-50/80"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <Checkbox
                checked={selectedIds.has(topic.id)}
                onCheckedChange={(checked) => onToggle(topic.id, checked === true)}
                className="size-3.5 rounded border-blue-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="truncate text-[13px] text-slate-700">{topic.title}</span>
            </div>
            <span className="ml-2 shrink-0 text-[11px] text-slate-400">
              {topic.videoCount}V · {topic.questionCount}Q
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TopicSelectionColumn;
