// Similar to types/admin-api.ts, but for the student side.
export type ApiResponse<T = any> = {
  status: boolean;
  message?: string;
  data?: T;
  token?: string;
  results?: number;
  totalResult?: number;
  totalPage?: number;
  currentPage?: number;
};

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "online" | "offline";
  isEmailVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  profileImage?: string;
  examTarget?: "jee_main" | "jee_advanced" | "neet";
  targetYear?: number;
  examDate?: string; // ISO Date string
  prepStartDate?: string;
  prepEndDate?: string;
  currentStreak?: number;
  longestStreak?: number;
  lastActiveAt?: string;
};

export type Subject = {
  _id: string;
  name: string;
  code: string;
  icon?: string;
  colorTheme?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
};

export type Chapter = {
  _id: string;
  subject: string | Subject;
  unitName: string;
  unitOrder: number;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  examWeightagePercent?: number;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  isActive: boolean;
  createdAt: string;
  videosCount?: number;
  notesCount?: number;
  questionsCount?: number;
};

export type Topic = {
  _id: string;
  subject: string | Subject;
  chapter: string | Chapter;
  title: string;
  order: number;
  isActive: boolean;
  createdAt: string;
};

export type Video = {
  _id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  subject: string | Subject;
  chapter: string | Chapter;
  topic: string | Topic;
  order: number;
  isActive: boolean;
  createdAt: string;
};

export type Note = {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  subject: string | Subject;
  chapter: string | Chapter;
  topic: string | Topic;
  order: number;
  isActive: boolean;
  createdAt: string;
};

export type Test = {
  _id: string;
  title: string;
  examTag?: string;
  mode: "mock" | "practice";
  testCategory: "chapter" | "subject" | "topic" | "full" | "custom" | "pyq";
  instructions?: string[];
  negativeMarking: boolean;
  totalQuestions: number;
  totalMarks: number;
  durationMins: number;
  scheduledAt?: string;
  isLive: boolean;
  isActive: boolean;
  createdAt: string;
  // populated when fetching single test
  questions?: {
    question: Question | string;
    subject?: Subject | string;
    chapter?: Chapter | string;
    topic?: Topic | string;
    order: number;
  }[];
};

export type Question = {
  _id: string;
  chapter: string | Chapter;
  subject: string | Subject;
  topic: string | Topic;
  questionText: string;
  questionImage?: string;
  questionType: "single" | "multiple" | "integer";
  options?: string[];
  answer?: number[];
  integerAnswer?: number;
  explanation?: string;
  explanationImage?: string[];
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  negativeMarks: number;
};

export type AnalysisBreakdown = {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  unanswered: number;
  marksObtained: number;
  maxMarks: number;
  accuracy: number;
};

export type SubjectAnalysis = AnalysisBreakdown & {
  subject: string | Subject;
};

export type TestAttempt = {
  _id: string;
  user: string;
  test: string | Test;
  mode: "mock" | "practice";
  attemptType: string;
  attemptNumber: number;
  status: "ongoing" | "completed" | "auto-submitted" | "abandoned";
  responses?: any[]; // Details can be typed if needed
  overallAnalysis?: AnalysisBreakdown;
  subjectWiseAnalysis?: SubjectAnalysis[];
  rank?: number;
  percentile?: number;
  totalParticipants?: number;
  startedAt: string;
  submittedAt?: string;
  timeTaken?: number;
  createdAt: string;
};
