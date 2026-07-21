"use client";

import { useState } from "react";
import CreateTimetableForm from "./create-timetable-form";
import ExcludeFromTimetable from "./exclude-from-timetable";
import TimetableCalendar from "./timetable-calendar";
import TopicTimeline from "./topic-timeline";
import TimetableDayDialog from "./timetable-day-dialog";
import { timetableStyles } from "./timetable-section";

const TimetablePageContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGenerate = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <div className={timetableStyles.page}>
        <div className={timetableStyles.container}>
          <CreateTimetableForm onGenerate={handleGenerate} />
          <ExcludeFromTimetable onGenerate={handleGenerate} />
          <TimetableCalendar />
          <TopicTimeline />
        </div>
      </div>

      <TimetableDayDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default TimetablePageContent;
