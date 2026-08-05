"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userSubjectApi } from "@/lib/api/user/subject";
import ChapterSidebar from "./study-materials/components/chapter-sidebar";
import { QuestionPagination } from "./practice-questions/components/QuestionPagination";
import { QuestionHeader } from "./practice-questions/components/QuestionHeader";
import { QuestionBody } from "./practice-questions/components/QuestionBody";
import { QuestionActionBar } from "./practice-questions/components/QuestionActionBar";
import { SessionOverview } from "./practice-questions/components/SessionOverview";

// ─── Question bank ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    subject: "PHYSICS",
    chapter: "Magnetic Effects of Current",
    topic: "Biot-Savart Law",
    tag: "MCQ" as const,
    exam: "JEE ADVANCED",
    year: "2022",
    body: "A long straight wire carries a current I. A particle of charge +q is moving with velocity v parallel to the wire, at a distance r from it. The magnetic force on the particle is:",
    options: [
      { key: "A" as const, text: "Directed towards the wire, magnitude = μ₀qvI / (2πr)" },
      { key: "B" as const, text: "Directed away from the wire, magnitude = μ₀qvI / (2πr)" },
      { key: "C" as const, text: "Zero, since the velocity is parallel to B" },
      { key: "D" as const, text: "Directed perpendicular to both v and r, magnitude = μ₀qvI / (4πr)" },
    ],
    correctAnswer: "C",
  },
  {
    id: 2,
    subject: "PHYSICS",
    chapter: "Magnetic Effects of Current",
    topic: "Ampere's Law",
    tag: "MCQ" as const,
    exam: "JEE MAINS",
    year: "2023",
    body: "A toroid has a core of inner radius 20 cm and outer radius 22 cm around which 4200 turns of a wire are wound. If the current in the wire is 10 A, the magnetic field inside the toroid is approximately:",
    options: [
      { key: "A" as const, text: "65 mT" },
      { key: "B" as const, text: "40 mT" },
      { key: "C" as const, text: "20 mT" },
      { key: "D" as const, text: "0 T" },
    ],
    correctAnswer: "B",
  },
  {
    id: 3,
    subject: "PHYSICS",
    chapter: "Magnetic Effects of Current",
    topic: "Cyclotron",
    tag: "MCQ" as const,
    exam: "JEE ADVANCED",
    year: "2021",
    body: "In a cyclotron, a proton is accelerated from rest. The cyclotron frequency depends on:",
    options: [
      { key: "A" as const, text: "The speed of the proton" },
      { key: "B" as const, text: "The radius of the circular path" },
      { key: "C" as const, text: "The charge-to-mass ratio of the proton and the magnetic field" },
      { key: "D" as const, text: "The electric field between the dees" },
    ],
    correctAnswer: "C",
  },
];

const TOTAL = 15;

type QuestionStatus = "correct" | "wrong" | "skipped" | "current" | "untouched";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  // Fetch all active subjects
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => userSubjectApi.getAllSubjects(),
  });
  const subjects = subjectsData?.data || [];

  useEffect(() => {
    if (subjects.length > 0 && !activeSubjectId) {
      setActiveSubjectId(subjects[0]._id);
    }
  }, [subjects, activeSubjectId]);

  // Fetch chapters for active subject
  const { data: chaptersData, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["chapters", "subject", activeSubjectId],
    queryFn: () => userSubjectApi.getChaptersBySubject(activeSubjectId!),
    enabled: !!activeSubjectId,
  });
  const chapters = chaptersData?.data || [];

  useEffect(() => {
    if (chapters.length > 0 && (!activeChapterId || !chapters.find(c => c._id === activeChapterId))) {
      setActiveChapterId(chapters[0]._id);
    }
  }, [chapters, activeChapterId]);

  const [currentQ, setCurrentQ]             = useState(1);
  const [selected, setSelected]             = useState<number | null>(null);
  const [showSolution, setShowSolution]     = useState(false);
  const [statusMap, setStatusMap]           = useState<Record<number, QuestionStatus>>({
    1: "current",
    2: "wrong",
    3: "untouched",
  });

  const question = QUESTIONS.find((q) => q.id === currentQ) ?? QUESTIONS[0];

  const goTo = (n: number) => {
    setStatusMap((prev) => ({
      ...prev,
      [currentQ]: prev[currentQ] === "current" ? "untouched" : prev[currentQ],
      [n]: "current",
    }));
    setCurrentQ(n);
    setSelected(null);
    setShowSolution(false);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === (question.correctAnswer.charCodeAt(0) - 65);
    setStatusMap((prev) => ({ ...prev, [currentQ]: isCorrect ? "correct" : "wrong" }));
    setShowSolution(true);
  };

  const handleSkip = () => {
    setStatusMap((prev) => ({ ...prev, [currentQ]: "skipped" }));
    if (currentQ < TOTAL) goTo(currentQ + 1);
  };

  const handleKnowAnswer = () => {
    setStatusMap((prev) => ({ ...prev, [currentQ]: "correct" }));
    if (currentQ < TOTAL) goTo(currentQ + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── LEFT: Chapter sidebar ── */}
      <ChapterSidebar
        subjects={subjects}
        chapters={chapters}
        activeSubjectId={activeSubjectId}
        onSubjectSelect={setActiveSubjectId}
        activeChapterId={activeChapterId}
        onChapterSelect={setActiveChapterId}
        isLoadingChapters={isChaptersLoading}
      />

      {/* ── CENTER: question area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Pagination bar */}
        <QuestionPagination
          total={TOTAL}
          current={currentQ}
          statusMap={statusMap}
          onChange={goTo}
        />

        {/* Question card */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <QuestionHeader
              questionNumber={currentQ}
              subject={question.subject}
              chapter={question.chapter}
              topic={question.topic}
              tag={question.tag}
              exam={question.exam}
              year={question.year}
            />

            <QuestionBody
              body={question.body}
              options={question.options.map((opt, i) => ({ index: i, label: opt.key, text: opt.text }))}
              selectedOptions={selected !== null ? [selected] : []}
              integerAnswer=""
              onSelectOption={(idx) => setSelected(idx)}
              onSelectInteger={() => {}}
              showAnswer={showSolution}
              correctOptions={[question.correctAnswer.charCodeAt(0) - 65]}
              type="single"
            />

            <QuestionActionBar
              onPrev={() => currentQ > 1 && goTo(currentQ - 1)}
              onNext={() => currentQ < TOTAL && goTo(currentQ + 1)}
              onSkip={handleSkip}
              onKnowAnswer={handleKnowAnswer}
              onShowSolution={() => setShowSolution(true)}
              onSubmit={handleSubmit}
              canSubmit={!!selected && !showSolution}
              hasPrev={currentQ > 1}
              hasNext={currentQ < TOTAL}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: session overview ── */}
      <SessionOverview
        total={TOTAL}
        currentQ={currentQ}
        statusMap={statusMap}
        onSelectQ={goTo}
      />
    </div>
  );
}
