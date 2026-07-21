export type CalendarTopicTag = {
  subject: "physics" | "maths";
  label: string;
};

export type CalendarDayEntry = {
  day: number;
  isOffDay?: boolean;
  isToday?: boolean;
  tags: CalendarTopicTag[];
  moreCount?: number;
};

export type TimelineBar = {
  id: string;
  label: string;
  fullLabel: string;
  startMonth: number;
  endMonth: number;
  color: string;
};

export const timetableMonths = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
] as const;

export const may2026Calendar: CalendarDayEntry[] = [
  { day: 1, tags: [{ subject: "physics", label: "Magnetic Effects" }, { subject: "maths", label: "Sequences &" }], moreCount: 2 },
  { day: 2, tags: [{ subject: "physics", label: "Magnetic Effects" }, { subject: "maths", label: "Binomial Theorem" }], moreCount: 2 },
  { day: 3, isOffDay: true, tags: [] },
  { day: 4, tags: [{ subject: "physics", label: "Magnetic Effects" }, { subject: "maths", label: "Matrices &" }], moreCount: 3 },
  { day: 5, tags: [{ subject: "physics", label: "Magnetism & Matter" }, { subject: "maths", label: "Limits &" }], moreCount: 2 },
  { day: 6, tags: [{ subject: "physics", label: "Magnetism & Matter" }, { subject: "maths", label: "Differentiation" }], moreCount: 2 },
  { day: 7, tags: [{ subject: "physics", label: "Magnetism & Matter" }, { subject: "maths", label: "Integration" }], moreCount: 3 },
  { day: 8, tags: [{ subject: "physics", label: "Electromagnetic inducti" }, { subject: "maths", label: "Definite Integrals" }], moreCount: 2 },
  { day: 9, tags: [{ subject: "physics", label: "Electromagnetic inducti" }, { subject: "maths", label: "3D Geometry" }], moreCount: 2 },
  { day: 10, isOffDay: true, tags: [] },
  { day: 11, tags: [{ subject: "physics", label: "Alternating Currents" }, { subject: "maths", label: "Vectors" }], moreCount: 2 },
  { day: 12, tags: [{ subject: "physics", label: "Alternating Currents" }, { subject: "maths", label: "Probability" }], moreCount: 2 },
  { day: 13, tags: [{ subject: "physics", label: "Ray Optics" }, { subject: "maths", label: "Complex Numbers" }], moreCount: 3 },
  { day: 14, tags: [{ subject: "physics", label: "Ray Optics" }, { subject: "maths", label: "Quadratic Equations" }], moreCount: 2 },
  { day: 15, tags: [{ subject: "physics", label: "Wave Optics" }, { subject: "maths", label: "Permutations &" }], moreCount: 2 },
  { day: 16, tags: [{ subject: "physics", label: "Wave Optics" }, { subject: "maths", label: "Differential Eq." }], moreCount: 2 },
  { day: 17, isOffDay: true, tags: [] },
  { day: 18, tags: [{ subject: "physics", label: "Dual Nature" }, { subject: "maths", label: "Sets, Relations" }], moreCount: 2 },
  { day: 19, tags: [{ subject: "physics", label: "Atoms & Nuclei" }, { subject: "maths", label: "Applications of" }], moreCount: 3 },
  { day: 20, tags: [{ subject: "physics", label: "Laws of Motion" }, { subject: "maths", label: "Sequences &" }], moreCount: 2 },
  { day: 21, tags: [{ subject: "physics", label: "Work Energy & Power" }, { subject: "maths", label: "Binomial Theorem" }], moreCount: 2 },
  { day: 22, tags: [{ subject: "physics", label: "Rotational Motion" }, { subject: "maths", label: "Matrices &" }], moreCount: 2 },
  { day: 23, tags: [{ subject: "physics", label: "Gravitation" }, { subject: "maths", label: "Limits &" }], moreCount: 3 },
  { day: 24, isOffDay: true, tags: [] },
  { day: 25, isToday: true, tags: [{ subject: "physics", label: "Electric Charges" }, { subject: "maths", label: "Complex Numbers" }], moreCount: 2 },
  { day: 26, tags: [{ subject: "physics", label: "Electrostatic Potential" }, { subject: "maths", label: "Integration" }], moreCount: 2 },
  { day: 27, tags: [{ subject: "physics", label: "Current Electricity" }, { subject: "maths", label: "Definite Integrals" }], moreCount: 2 },
  { day: 28, tags: [{ subject: "physics", label: "Magnetic Effects" }, { subject: "maths", label: "3D Geometry" }], moreCount: 3 },
  { day: 29, tags: [{ subject: "physics", label: "Magnetism & Matter" }, { subject: "maths", label: "Vectors" }], moreCount: 2 },
  { day: 30, tags: [{ subject: "physics", label: "Electromagnetic inducti" }, { subject: "maths", label: "Probability" }], moreCount: 2 },
  { day: 31, tags: [{ subject: "physics", label: "Ray Optics" }, { subject: "maths", label: "Differentiation" }], moreCount: 2 },
];

export const physicsTimelineBars: TimelineBar[] = [
  { id: "pt-1", label: "Electric Charges..", fullLabel: "Electric Charges", startMonth: 0, endMonth: 0.8, color: "#3b82c6" },
  { id: "pt-2", label: "Electrostatic P..", fullLabel: "Electrostatic Potential", startMonth: 0.6, endMonth: 1.4, color: "#6366f1" },
  { id: "pt-3", label: "Current Electricity", fullLabel: "Current Electricity", startMonth: 1.2, endMonth: 2.2, color: "#8b5cf6" },
  { id: "pt-4", label: "Magnetic Effects of Curr..", fullLabel: "Magnetic Effects of Current", startMonth: 2, endMonth: 3.2, color: "#a855f7" },
  { id: "pt-5", label: "Magnetism..", fullLabel: "Magnetism & Matter", startMonth: 3, endMonth: 3.8, color: "#d946ef" },
  { id: "pt-6", label: "Electromagnetic Ind..", fullLabel: "Electromagnetic Induction", startMonth: 3.6, endMonth: 4.6, color: "#ec4899" },
  { id: "pt-7", label: "Alternating Curr..", fullLabel: "Alternating Currents", startMonth: 4.4, endMonth: 5.2, color: "#f43f5e" },
  { id: "pt-8", label: "Ray Optics", fullLabel: "Ray Optics", startMonth: 5, endMonth: 6.2, color: "#f97316" },
];

export const mathsTimelineBars: TimelineBar[] = [
  { id: "mt-1", label: "Sets, Relati..", fullLabel: "Sets, Relations & Functions", startMonth: 0, endMonth: 0.7, color: "#ea580c" },
  { id: "mt-2", label: "Complex Num..", fullLabel: "Complex Numbers", startMonth: 0.5, endMonth: 1.3, color: "#c2410c" },
  { id: "mt-3", label: "Quadrati..", fullLabel: "Quadratic Equations", startMonth: 1.1, endMonth: 1.8, color: "#b45309" },
  { id: "mt-4", label: "Sequences & Ser..", fullLabel: "Sequences & Series", startMonth: 1.6, endMonth: 2.4, color: "#d97706" },
  { id: "mt-5", label: "Permutations..", fullLabel: "Permutations & Combinations", startMonth: 2.2, endMonth: 3, color: "#ca8a04" },
  { id: "mt-6", label: "Matrices & Determ..", fullLabel: "Matrices & Determinants", startMonth: 2.8, endMonth: 3.6, color: "#eab308" },
  { id: "mt-7", label: "Limits & Continu..", fullLabel: "Limits & Continuity", startMonth: 3.4, endMonth: 4.2, color: "#a8a29e" },
  { id: "mt-8", label: "Differentiation", fullLabel: "Differentiation", startMonth: 4, endMonth: 4.8, color: "#78716c" },
  { id: "mt-9", label: "Applications o..", fullLabel: "Applications of Derivatives", startMonth: 4.6, endMonth: 5.4, color: "#64748b" },
];

export const timelineTodayMonth = 4;
export const timelineTodayDay = 12;
