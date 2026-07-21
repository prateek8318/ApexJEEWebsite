export type SubjectId = "physics" | "maths";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type VideoStatus = "watched" | "in-progress" | "unwatched";

export type SelfLearningVideo = {
  id: number;
  title: string;
  subtopic: string;
  duration: string;
  difficulty: DifficultyLevel;
  examTag?: string;
  status: VideoStatus;
  watchProgress?: number;
  type: "Lecture" | "Problem" | "Revision";
};

export type VideoSection = {
  id: string;
  title: string;
  videos: SelfLearningVideo[];
};

export type SelfLearningChapter = {
  id: string;
  number: number;
  title: string;
  unit: string;
  progress: number;
  videoCount: number;
  questionCount: number;
  pdfCount: number;
  status: "completed" | "in-progress" | "not-started";
  subtopics: string[];
  videoSections: VideoSection[];
  revisionNotesCount: number;
  practiceQuestionsCount: number;
};

export type SelfLearningUnit = {
  id: string;
  title: string;
  chapters: SelfLearningChapter[];
};

export type SelfLearningSubject = {
  id: SubjectId;
  label: string;
  units: SelfLearningUnit[];
};
