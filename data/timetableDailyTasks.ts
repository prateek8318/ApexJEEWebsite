export type LectureTask = {
  id: string;
  title: string;
  videoIndex: number;
  videoTotal: number;
  duration: string;
};

export type PracticeTask = {
  id: string;
  topic: string;
  batchLabel: string;
  batchStart: number;
  batchEnd: number;
  totalQuestions: number;
};

export type SubjectDailyTasks = {
  id: "physics" | "mathematics";
  label: string;
  lectures: LectureTask[];
  practice: PracticeTask[];
};

export const dailyTasksDate = new Date(2026, 4, 4);

export const dailyTasks: SubjectDailyTasks[] = [
  {
    id: "physics",
    label: "Physics",
    lectures: [
      {
        id: "phy-lec-1",
        title: "Electromagnetic Induction",
        videoIndex: 4,
        videoTotal: 10,
        duration: "35 min",
      },
      {
        id: "phy-lec-2",
        title: "Magnetic Effects of Current",
        videoIndex: 2,
        videoTotal: 8,
        duration: "28 min",
      },
    ],
    practice: [
      {
        id: "phy-prac-1",
        topic: "Alternating Currents",
        batchLabel: "Today's batch: Q11-Q25",
        batchStart: 11,
        batchEnd: 25,
        totalQuestions: 100,
      },
    ],
  },
  {
    id: "mathematics",
    label: "Mathematics",
    lectures: [
      {
        id: "math-lec-1",
        title: "Matrices & Determinants",
        videoIndex: 3,
        videoTotal: 9,
        duration: "42 min",
      },
    ],
    practice: [
      {
        id: "math-prac-1",
        topic: "Integration",
        batchLabel: "Today's batch: Q31-Q50",
        batchStart: 31,
        batchEnd: 50,
        totalQuestions: 100,
      },
    ],
  },
];
