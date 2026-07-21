// ─── Types ──────────────────────────────────────────────────────────────────

export interface WeeklyData {
  week: string;
  actualVideos: number;
  targetVideos: number;
  actualQuestions: number;
  targetQuestions: number;
  videoBacklog: number;
  questionBacklog: number;
}

export interface ChapterPerformance {
  chapter: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface MockTestResult {
  id: string;
  testName: string;
  type: "Main" | "Advanced";
  date: string;
  phyScore: string;
  matScore: string;
  total: number;
  phyCorrect: string;
  matCorrect: string;
  expectedRank: string;
  change: number;
}

export interface WeakArea {
  id: string;
  subject: "PHYSICS" | "MATHS";
  topic: string;
  chapter: string;
  accuracy: number;
  priority: "High" | "Critical";
  practiceErrors: number;
  mockErrors: number;
  totalWrong: number;
}

export interface FlaggedItem {
  id: string;
  type: "VIDEO" | "QUESTION" | "TOPIC";
  title: string;
  subject: string;
  chapter: string;
  taggedDate: string;
}

// ─── Weekly Data ─────────────────────────────────────────────────────────────

export const weeklyData: WeeklyData[] = [
  { week: "W1",  actualVideos: 8,  targetVideos: 10, actualQuestions: 45, targetQuestions: 50, videoBacklog: 12, questionBacklog: 18 },
  { week: "W2",  actualVideos: 11, targetVideos: 10, actualQuestions: 52, targetQuestions: 50, videoBacklog: 10, questionBacklog: 22 },
  { week: "W3",  actualVideos: 9,  targetVideos: 10, actualQuestions: 44, targetQuestions: 50, videoBacklog: 15, questionBacklog: 25 },
  { week: "W4",  actualVideos: 13, targetVideos: 10, actualQuestions: 58, targetQuestions: 50, videoBacklog: 8,  questionBacklog: 14 },
  { week: "W5",  actualVideos: 10, targetVideos: 10, actualQuestions: 50, targetQuestions: 50, videoBacklog: 9,  questionBacklog: 18 },
  { week: "W6",  actualVideos: 14, targetVideos: 10, actualQuestions: 63, targetQuestions: 50, videoBacklog: 7,  questionBacklog: 12 },
  { week: "W7",  actualVideos: 12, targetVideos: 10, actualQuestions: 55, targetQuestions: 50, videoBacklog: 11, questionBacklog: 20 },
  { week: "W8",  actualVideos: 15, targetVideos: 10, actualQuestions: 68, targetQuestions: 50, videoBacklog: 6,  questionBacklog: 10 },
  { week: "W9",  actualVideos: 16, targetVideos: 10, actualQuestions: 72, targetQuestions: 50, videoBacklog: 5,  questionBacklog: 8  },
  { week: "W10", actualVideos: 18, targetVideos: 10, actualQuestions: 78, targetQuestions: 50, videoBacklog: 4,  questionBacklog: 6  },
  { week: "W11", actualVideos: 17, targetVideos: 10, actualQuestions: 74, targetQuestions: 50, videoBacklog: 7,  questionBacklog: 14 },
  { week: "W12", actualVideos: 20, targetVideos: 10, actualQuestions: 85, targetQuestions: 50, videoBacklog: 3,  questionBacklog: 5  },
  { week: "W13", actualVideos: 22, targetVideos: 10, actualQuestions: 90, targetQuestions: 50, videoBacklog: 2,  questionBacklog: 4  },
];

// ─── Chapter Performance ─────────────────────────────────────────────────────

export const physicsChapters: ChapterPerformance[] = [
  { chapter: "Electric Charges & Fields",    attempted: 45, correct: 42, accuracy: 93 },
  { chapter: "Electrostatic Potential",       attempted: 36, correct: 33, accuracy: 92 },
  { chapter: "Current Electricity",           attempted: 44, correct: 38, accuracy: 86 },
  { chapter: "Magnetic Effects of Current",   attempted: 28, correct: 20, accuracy: 71 },
  { chapter: "Magnetism & Matter",            attempted: 18, correct: 12, accuracy: 67 },
];

export const mathsChapters: ChapterPerformance[] = [
  { chapter: "Sets, Relations & Functions",   attempted: 40, correct: 38, accuracy: 95 },
  { chapter: "Complex Numbers",               attempted: 40, correct: 35, accuracy: 88 },
  { chapter: "Quadratic Equations",           attempted: 34, correct: 29, accuracy: 85 },
  { chapter: "Sequences & Series",            attempted: 38, correct: 32, accuracy: 84 },
  { chapter: "Permutations & Combinations",   attempted: 28, correct: 21, accuracy: 75 },
];

// ─── Mock Test Results ────────────────────────────────────────────────────────

export const mockTestResults: MockTestResult[] = [
  { id: "1", testName: "JEE Main Mock #1", type: "Main",     date: "16 Feb 2026", phyScore: "76/150", matScore: "62/150", total: 138, phyCorrect: "19/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "2", testName: "JEE Main Mock #2", type: "Main",     date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "20/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "3", testName: "JEE Main Mock #3", type: "Main",     date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "20/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "4", testName: "JEE Adv Mock #1",  type: "Advanced", date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "16/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "5", testName: "JEE Main Mock #4", type: "Main",     date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "20/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "6", testName: "JEE Adv Mock #2",  type: "Advanced", date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "16/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "7", testName: "JEE Main Mock #5", type: "Main",     date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "20/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "8", testName: "JEE Main Mock #6", type: "Main",     date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "20/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
  { id: "9", testName: "JEE Main Mock #7", type: "Main",     date: "21 Feb 2026", phyScore: "80/150", matScore: "65/150", total: 145, phyCorrect: "20/25", matCorrect: "16/25", expectedRank: "#7,820", change: -420 },
];

// ─── Weak Areas ───────────────────────────────────────────────────────────────

export const weakAreas: WeakArea[] = [
  { id: "1", subject: "PHYSICS", topic: "Electromagnetic Induction", chapter: "Ch 06", accuracy: 43, priority: "High",     practiceErrors: 8,  mockErrors: 12, totalWrong: 20 },
  { id: "2", subject: "MATHS",   topic: "3D Geometry",               chapter: "Ch 17", accuracy: 36, priority: "Critical", practiceErrors: 9,  mockErrors: 10, totalWrong: 19 },
  { id: "3", subject: "PHYSICS", topic: "Alternating Currents",      chapter: "Ch 07", accuracy: 50, priority: "High",     practiceErrors: 4,  mockErrors: 8,  totalWrong: 20 },
  { id: "4", subject: "MATHS",   topic: "Differential Equations",    chapter: "Ch 12", accuracy: 42, priority: "High",     practiceErrors: 7,  mockErrors: 7,  totalWrong: 6  },
  { id: "5", subject: "PHYSICS", topic: "Wave Optics",               chapter: "Ch 09", accuracy: 50, priority: "High",     practiceErrors: 6,  mockErrors: 6,  totalWrong: 20 },
  { id: "6", subject: "MATHS",   topic: "Definite Integrals",        chapter: "Ch 13", accuracy: 50, priority: "High",     practiceErrors: 11, mockErrors: 5,  totalWrong: 20 },
];

// ─── Flagged Items ────────────────────────────────────────────────────────────

export const flaggedItems: FlaggedItem[] = [
  { id: "1",  type: "VIDEO",    title: "Biot-Savart Law — Derivation & Applications",  subject: "Physics", chapter: "Ch 04 · Magnetic Effects",      taggedDate: "12 May 2026" },
  { id: "2",  type: "VIDEO",    title: "Why does induced EMF oppose change in flux?",   subject: "Physics", chapter: "Ch 06 · EM Induction",           taggedDate: "11 May 2026" },
  { id: "3",  type: "QUESTION", title: "Find image for concave mirror when u = 2f",    subject: "Physics", chapter: "Ch 08 · Ray Optics",             taggedDate: "10 May 2026" },
  { id: "4",  type: "VIDEO",    title: "Integration by Parts — Advanced Techniques",   subject: "Maths",   chapter: "Ch 11 · Integration",            taggedDate: "9 May 2026"  },
  { id: "5",  type: "QUESTION", title: "Prove |det(AB)| = |det A| · |det B|",          subject: "Maths",   chapter: "Ch 04 · Matrices",               taggedDate: "6 May 2026"  },
  { id: "6",  type: "TOPIC",    title: "Electromagnetic Induction — Full Chapter",     subject: "Physics", chapter: "Ch 07 · 90+ questions",          taggedDate: "7 May 2026"  },
  { id: "7",  type: "VIDEO",    title: "Faraday's Law & Lenz's Law — Derivations",     subject: "Physics", chapter: "Ch 06 · EM Induction",           taggedDate: "6 May 2026"  },
  { id: "8",  type: "QUESTION", title: "∫^n x sin x dx = ?",                          subject: "Maths",   chapter: "Ch 12 · Definite Integrals",     taggedDate: "5 May 2026"  },
  { id: "9",  type: "TOPIC",    title: "3D Geometry & Vectors — Combined",             subject: "Maths",   chapter: "Ch 18 · 74 questions",           taggedDate: "5 May 2026"  },
  { id: "10", type: "VIDEO",    title: "Alternating Currents — RLC Circuits",          subject: "Physics", chapter: "Ch 07 · Alternating Currents",   taggedDate: "5 May 2026"  },
];
