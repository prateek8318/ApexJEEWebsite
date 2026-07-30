export interface Subject {
  _id: string;
  name: string;
  code: string;
  icon?: string;
  colorTheme?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  createdAtIST?: string;
}

export interface Chapter {
  _id: string;
  subject: string | Subject;
  unitName: string;
  unitOrder: number;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  description?: string;
  tags: string[];
  examWeightagePercent: number;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  isActive: boolean;
  createdAt: string;
  createdAtIST?: string;
  videosCount?: number;
  notesCount?: number;
  questionsCount?: number;
}

export interface Topic {
  _id: string;
  subject: string | Subject;
  chapter: string | Chapter;
  title: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  createdAtIST?: string;
}

export interface Question {
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
  examTag?: string;
  marks: number;
  negativeMarks: number;
  source: {
    type: "pyq" | "practice" | "mock" | "all";
    exam?: string;
    year?: number;
    shift?: number;
    institute?: string;
  };
  attemptedCount: number;
  correctCount: number;
  isActive: boolean;
  createdAt: string;
  createdAtIST?: string;
}

export interface Video {
  _id: string;
  subject: string | Subject;
  chapter: string | Chapter;
  topic?: string | Topic;
  title: string;
  description?: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  durationMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  examTag?: string;
  views: number;
  order: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  createdAtIST?: string;
}

export interface Note {
  _id: string;
  subject: string | Subject;
  chapter: string | Chapter;
  topic?: string | Topic;
  title: string;
  type: "notes" | "formula" | "solved_example";
  fileUrl: string;
  pageCount: number;
  tags: string[];
  isPremium: boolean;
  order: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  createdAtIST?: string;
  updatedAtIST?: string;
}

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  status: boolean;
  message?: string;
  data?: T;
  results?: number;
}
