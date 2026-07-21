export type TimetableTopic = {
  id: string;
  title: string;
  videoCount: number;
  questionCount: number;
};

export const physicsTopics: TimetableTopic[] = [
  { id: "phy-01", title: "Electric Charges & Fields", videoCount: 8, questionCount: 100 },
  { id: "phy-02", title: "Electrostatic Potential", videoCount: 12, questionCount: 120 },
  { id: "phy-03", title: "Current Electricity", videoCount: 10, questionCount: 90 },
  { id: "phy-04", title: "Magnetic Effects of Current", videoCount: 6, questionCount: 75 },
  { id: "phy-05", title: "Magnetism & Matter", videoCount: 14, questionCount: 110 },
  { id: "phy-06", title: "Electromagnetic Induction", videoCount: 9, questionCount: 85 },
  { id: "phy-07", title: "Alternating Currents", videoCount: 11, questionCount: 105 },
  { id: "phy-08", title: "Ray Optics", videoCount: 7, questionCount: 65 },
  { id: "phy-09", title: "Wave Optics", videoCount: 8, questionCount: 70 },
  { id: "phy-10", title: "Dual Nature of Radiation", videoCount: 5, questionCount: 55 },
  { id: "phy-11", title: "Atoms & Nuclei", videoCount: 13, questionCount: 115 },
  { id: "phy-12", title: "Laws of Motion", videoCount: 10, questionCount: 95 },
  { id: "phy-13", title: "Work Energy & Power", videoCount: 7, questionCount: 60 },
  { id: "phy-14", title: "Rotational Motion", videoCount: 9, questionCount: 80 },
  { id: "phy-15", title: "Gravitation", videoCount: 6, questionCount: 50 },
];

export const mathematicsTopics: TimetableTopic[] = [
  { id: "math-01", title: "Sets, Relations & Functions", videoCount: 8, questionCount: 100 },
  { id: "math-02", title: "Complex Numbers", videoCount: 12, questionCount: 120 },
  { id: "math-03", title: "Quadratic Equations", videoCount: 10, questionCount: 90 },
  { id: "math-04", title: "Sequences & Series", videoCount: 6, questionCount: 75 },
  { id: "math-05", title: "Permutations & Combinations", videoCount: 14, questionCount: 110 },
  { id: "math-06", title: "Binomial Theorem", videoCount: 9, questionCount: 85 },
  { id: "math-07", title: "Matrices & Determinants", videoCount: 11, questionCount: 105 },
  { id: "math-08", title: "Limits & Continuity", videoCount: 7, questionCount: 65 },
  { id: "math-09", title: "Differentiation", videoCount: 8, questionCount: 70 },
  { id: "math-10", title: "Applications of Derivatives", videoCount: 5, questionCount: 55 },
  { id: "math-11", title: "Integration", videoCount: 13, questionCount: 115 },
  { id: "math-12", title: "Definite Integrals", videoCount: 10, questionCount: 95 },
  { id: "math-13", title: "Differential Equations", videoCount: 7, questionCount: 60 },
  { id: "math-14", title: "3D Geometry", videoCount: 9, questionCount: 80 },
  { id: "math-15", title: "Vectors", videoCount: 6, questionCount: 50 },
  { id: "math-16", title: "Probability", videoCount: 8, questionCount: 75 },
];

export const subjectOptions = [
  { value: "physics-maths", label: "Physics + Mathematics" },
  { value: "physics", label: "Physics Only" },
  { value: "mathematics", label: "Mathematics Only" },
] as const;
