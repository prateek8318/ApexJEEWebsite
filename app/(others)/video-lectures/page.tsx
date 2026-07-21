"use client";

import { useState } from "react";
import TopNav from "./components/TopNav";
import VideoPlayer from "./components/VideoPlayer";
import LectureControls from "./components/LectureControls";
import MyNotes from "./components/MyNotes";

const LECTURES = [
  { id: 1, title: "Introduction to Magnetic Effects", duration: "35 min" },
  { id: 2, title: "Biot-Savart Law", duration: "42 min" },
  { id: 3, title: "Ampere's Circuital Law", duration: "38 min" },
  { id: 4, title: "Moving Charges in a Magnetic Field", duration: "45 min" },
  {
    id: 5,
    title: "Ampere's Law — Applications: Solenoid & Toroid",
    duration: "40 min",
  },
  { id: 6, title: "Force Between Two Parallel Conductors", duration: "30 min" },
  { id: 7, title: "Torque on a Current Loop", duration: "37 min" },
  { id: 8, title: "Moving Coil Galvanometer", duration: "44 min" },
  { id: 9, title: "Magnetism and Matter", duration: "50 min" },
  { id: 10, title: "Magnetic Properties of Materials", duration: "41 min" },
  { id: 11, title: "Earth's Magnetism", duration: "33 min" },
  { id: 12, title: "Revision & PYQs", duration: "55 min" },
];

export default function VideoLecturePage() {
  const [currentIndex, setCurrentIndex] = useState(4); // 0-based → lecture 5
  const [watchedSet, setWatchedSet] = useState<Set<number>>(new Set([0, 1, 2, 3]));

  const lecture = LECTURES[currentIndex];
  const isWatched = watchedSet.has(currentIndex);
  const progress = Math.round((watchedSet.size / LECTURES.length) * 100);

  const handleMarkWatched = () => {
    setWatchedSet((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < LECTURES.length - 1) setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        currentSubject="Physics — Magnetic Effects"
        currentChapter="Mathematics — Select Chapter"
        progress={progress}
        watched={watchedSet.size}
        total={LECTURES.length}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          <VideoPlayer />
          <LectureControls
            onPrev={handlePrev}
            onNext={handleNext}
            onMarkWatched={handleMarkWatched}
            isWatched={isWatched}
            lectureNumber={lecture.id}
            lectureTitle={lecture.title}
            duration={lecture.duration}
          />
          <div className="mt-4">
            <MyNotes key={currentIndex} />
          </div>
        </main>
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-sm font-semibold text-gray-800">Lecture List</span>
            <span className="text-xs text-gray-500">{LECTURES.length} lectures</span>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {LECTURES.map((l, i) => {
              const done = watchedSet.has(i);
              const active = i === currentIndex;
              return (
                <li
                  key={l.id}
                  className={`flex items-start gap-2 p-3 rounded transition-colors ${active ? "bg-indigo-100 border-l-4 border-indigo-600" : ""} ${done ? "opacity-70" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${done ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                    {done && (
                      <svg viewBox="0 0 16 16" fill="none" width="10" height="10">
                        <path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${active ? "text-indigo-600 font-medium" : "text-gray-800"}`}>{l.id}. {l.title}</p>
                    <p className="text-xs text-gray-500">Lecture · {l.duration}</p>
                  </div>
                  {active && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5" />}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
