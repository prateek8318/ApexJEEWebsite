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

export interface VideoCategory {
  _id: string;
  topic?: string | Topic;
  title: string;
  order: number;
  isActive: boolean;
  createdBy?: string | Admin;
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
  noteUrl?: string;
  durationMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  examTag?: string;
  videoCategory?: string | VideoCategory;
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
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  status: boolean;
  message?: string;
  data?: T;
  results?: number;
  totalResult?: number;
  totalPage?: number;
  limit?: number;
  page?: number;
}

export interface Test {
  _id: string;
  title: string;
  examTag?: string;
  mode?: string;
  testCategory?: string;
  topic?: string | any;
  instructions?: any;
  negativeMarking: boolean;
  durationMins: number;
  scheduledAt?: string;
  isLive: boolean;
  isActive: boolean;
  questions?: Array<{
    question: string | Question;
    subject: string | Subject;
    chapter: string | Chapter;
    topic: string | Topic;
    order: number;
  }>;
  totalQuestions?: number;
  totalMarks?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  code: string;
  planType: "trial" | "monthly" | "quarterly" | "yearly";
  price: number;
  billingCycleDays: number;
  compareAtPrice?: number | null;
  savePercent: number;
  isTrial: boolean;
  trialDays: number;
  badge?: string | null;
  highlight: boolean;
  features: Array<{
    label: string;
    included: boolean;
    _id?: string;
  }>;
  limits: {
    fullContentAccess: boolean;
    mockTestsPerCycle: number | null;
    smartTimetable: "none" | "limited" | "full";
    performanceAnalytics: "none" | "basic" | "full";
    doubtResolutionPriority: boolean;
    tutorProgressAccess: boolean;
    downloadableReports: boolean;
  };
  ctaLabel: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  createdAtIST?: string;
}


export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  examTarget: "jee_main" | "jee_advanced" | "neet";
  targetYear?: number;
  examDate?: string;
  prepStartDate?: string;
  prepEndDate?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt?: string;
  status: "online" | "offline";
  isEmailVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  createdAtIST?: string;
}
export interface Admin {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profileImage?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  referralCode?: string | null;
  termsAccepted: boolean;
  isDeleted: boolean;
  createdAt: string;
  approvedAt?: string;
}
