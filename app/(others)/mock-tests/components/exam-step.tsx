"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ZoomIn
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import SubmitModal from "./submit-modal";

interface Question {
  id: number;
  section: "physics" | "mathematics";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  year: string;
  text: string;
  formula?: string;
  options: string[];
  correctAnswer: number; 
}

interface ExamStepProps {
  testTitle: string;
  onFinishTest: (results: {
    score: number;
    totalQuestions: number;
    answered: number;
    skipped: number;
    marked: number;
    notAttempted: number;
    correct: number;
    wrong: number;
  }) => void;
}

const QUESTIONS_DATA: Question[] = [
  // PHYSICS (Questions 1 to 10)
  {
    id: 1,
    section: "physics",
    topic: "KINEMATICS • PROJECTILE MOTION",
    difficulty: "Medium",
    year: "JEE Main 2023",
    text: "A projectile is thrown with an initial velocity of (î + 2ĵ) m/s. If g = 10 m/s², the equation of its trajectory is:",
    options: ["y = 2x - 5x²", "y = 2x - 2.5x²", "y = x - 5x²", "y = 2x - 1.25x²"],
    correctAnswer: 1
  },
  {
    id: 2,
    section: "physics",
    topic: "ELECTROSTATICS • ELECTRIC FIELD",
    difficulty: "Hard",
    year: "JEE Main 2021",
    text: "Two point charges q and -3q are placed at a distance d apart. The electromagnetic potential is zero at a point on the line joining them at a distance of:",
    options: ["d/4 from q", "d/3 from q", "d/2 from -3q", "d/5 from -3q"],
    correctAnswer: 0
  },
  {
    id: 3,
    section: "physics",
    topic: "THERMODYNAMICS • CARNOT CYCLE",
    difficulty: "Easy",
    year: "JEE Main 2022",
    text: "A Carnot engine has efficiency of 50% when its sink temperature is at 27°C. The source temperature is:",
    options: ["300°C", "327°C", "273°C", "600°C"],
    correctAnswer: 1
  },
  {
    id: 4,
    section: "physics",
    topic: "OPTICS • WAVE OPTICS",
    difficulty: "Medium",
    year: "JEE Main 2023",
    text: "In Young's double slit experiment, the ratio of maximum to minimum intensity in the interference pattern is 25:9. The ratio of amplitudes of the coherent sources is:",
    options: ["5:3", "4:1", "16:9", "25:3"],
    correctAnswer: 1
  },
  {
    id: 5,
    section: "physics",
    topic: "MAGNETISM • BIOT-SAVART LAW",
    difficulty: "Medium",
    year: "JEE Main 2020",
    text: "A long straight wire carries a current of 35 A. The magnitude of magnetic field B at a point 20 cm from the wire is:",
    options: ["3.5 × 10⁻⁵ T", "3.5 × 10⁻⁶ T", "1.75 × 10⁻⁵ T", "7.0 × 10⁻⁵ T"],
    correctAnswer: 0
  },
  {
    id: 6,
    section: "physics",
    topic: "ROTATIONAL MOTION • MOMENT OF INERTIA",
    difficulty: "Hard",
    year: "JEE Main 2022",
    text: "The ratio of radius of gyration of a solid sphere of mass M and radius R about its own axis to that of a thin hollow sphere of same mass and radius about its axis is:",
    options: ["√(2/5) : √(2/3)", "√(3/5) : 1", "√(2/3) : √(2/5)", "√(3/5) : √(2/5)"],
    correctAnswer: 0
  },
  {
    id: 7,
    section: "physics",
    topic: "CURRENT ELECTRICITY • WHEATSTONE BRIDGE",
    difficulty: "Easy",
    year: "JEE Main 2024",
    text: "Four resistances of 10 Ω, 15 Ω, 20 Ω and 30 Ω are connected to form a Wheatstone bridge. The bridge is:",
    options: ["Balanced", "Unbalanced, current flows from higher to lower node", "Unbalanced, current is zero in galvanometer", "None of these"],
    correctAnswer: 0
  },
  {
    id: 8,
    section: "physics",
    topic: "MODERN PHYSICS • PHOTOELECTRIC EFFECT",
    difficulty: "Medium",
    year: "JEE Main 2023",
    text: "The stopping potential for photoelectrons emitted from a surface when light of wavelength λ is incident is V₀. If the wavelength is doubled, the stopping potential becomes:",
    options: ["V₀ / 2", "More than V₀ / 2", "Less than V₀ / 2", "V₀"],
    correctAnswer: 2
  },
  {
    id: 9,
    section: "physics",
    topic: "WAVES • DOPPLER EFFECT",
    difficulty: "Hard",
    year: "JEE Main 2021",
    text: "A source of sound emitting frequency 450 Hz approaches a stationary observer with a velocity of 33 m/s. If speed of sound is 330 m/s, the apparent frequency heard is:",
    options: ["500 Hz", "400 Hz", "495 Hz", "405 Hz"],
    correctAnswer: 0
  },
  {
    id: 10,
    section: "physics",
    topic: "GRAVITATION • ESCAPE VELOCITY",
    difficulty: "Easy",
    year: "JEE Main 2022",
    text: "The escape velocity from the Earth is 11.2 km/s. The escape velocity from a planet having twice the radius and same mean density as Earth is:",
    options: ["22.4 km/s", "11.2 km/s", "5.6 km/s", "44.8 km/s"],
    correctAnswer: 0
  },

  // MATHEMATICS (Questions 11 to 20)
  {
    id: 11,
    section: "mathematics",
    topic: "ALGEBRA • QUADRATIC EQUATIONS",
    difficulty: "Easy",
    year: "JEE Main 2022",
    text: "If α and β are the roots of the equation x² - 6x + 8 = 0, then the value of α³ + β³ is:",
    options: ["72", "99", "120", "216"],
    correctAnswer: 0
  },
  {
    id: 12,
    section: "mathematics",
    topic: "CALCULUS • LIMITS",
    difficulty: "Medium",
    year: "JEE Main 2023",
    text: "The limit as x approaches 0 of (sin(5x) / tan(3x)) is:",
    options: ["5/3", "3/5", "1", "0"],
    correctAnswer: 0
  },
  {
    id: 13,
    section: "mathematics",
    topic: "COORDINATE GEOMETRY • PARABOLA",
    difficulty: "Hard",
    year: "JEE Main 2021",
    text: "The focal chord of the parabola y² = 16x is tangent to the circle (x - 6)² + y² = 4. The slope of this chord is:",
    options: ["± 1/√3", "± 1", "± √3", "± 2"],
    correctAnswer: 0
  },
  {
    id: 14,
    section: "mathematics",
    topic: "CALCULUS • DEFINITE INTEGRATION",
    difficulty: "Hard",
    year: "JEE Main 2022",
    text: "The integral of sin²(x) dx from 0 to π/2 is equal to:",
    options: ["π / 2", "π / 4", "π / 8", "1"],
    correctAnswer: 1
  },
  {
    id: 15,
    section: "mathematics",
    topic: "VECTORS • SCALAR TRIPLE PRODUCT",
    difficulty: "Medium",
    year: "JEE Main 2024",
    text: "If vectors â, b̂, and ĉ are coplanar, then the scalar triple product [â b̂ ĉ] is:",
    options: ["0", "1", "-1", "Depends on angles"],
    correctAnswer: 0
  },
  {
    id: 16,
    section: "mathematics",
    topic: "PROBABILITY • BAYES THEOREM",
    difficulty: "Medium",
    year: "JEE Main 2023",
    text: "A bag contains 3 red and 5 black balls. Another bag contains 6 red and 4 black balls. A ball is drawn at random from one of the bags; it is found to be red. The probability that it was drawn from the second bag is:",
    options: ["16/31", "15/31", "12/25", "16/25"],
    correctAnswer: 0
  },
  {
    id: 17,
    section: "mathematics",
    topic: "MATRIX • DETERMINANTS",
    difficulty: "Easy",
    year: "JEE Main 2022",
    text: "If A is a 3x3 matrix and |A| = 4, then the value of determinant of 2A is:",
    options: ["8", "16", "32", "64"],
    correctAnswer: 2
  },
  {
    id: 18,
    section: "mathematics",
    topic: "TRIGONOMETRY • INVERSE TRIG",
    difficulty: "Medium",
    year: "JEE Main 2021",
    text: "The value of sin(cot⁻¹(cos(tan⁻¹(1)))) is equal to:",
    options: ["√(2/3)", "1/2", "√(3/2)", "1/√3"],
    correctAnswer: 0
  },
  {
    id: 19,
    section: "mathematics",
    topic: "CALCULUS • DIFFERENTIAL EQUATIONS",
    difficulty: "Hard",
    year: "JEE Main 2023",
    text: "The integrating factor of the differential equation (1 + x²) dy/dx + 2xy = cos(x) is:",
    options: ["e^(x²)", "1 + x²", "log(1 + x²)", "1 / (1 + x²)"],
    correctAnswer: 1
  },
  {
    id: 20,
    section: "mathematics",
    topic: "ALGEBRA • BINOMIAL THEOREM",
    difficulty: "Medium",
    year: "JEE Main 2022",
    text: "Constant term in expansion of (x + 1/x)⁸ is:",
    options: ["35", "56", "70", "84"],
    correctAnswer: 2
  }
];

export default function ExamStep({ testTitle, onFinishTest }: ExamStepProps) {
  const [questions] = useState<Question[]>(QUESTIONS_DATA);
  const [currentIndex, setCurrentIndex] = useState(19); 
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({
    1: 0, 2: 1, 3: 0, 4: 2, 5: 1, 6: 0, 7: 0, 8: 1, 9: 0, 10: 2, 
    11: 1, 12: 0, 13: 2, 14: 1, 15: 0, 17: 2, 19: 1 
  });
  
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, "not_visited" | "skipped" | "answered" | "marked">>({
    1: "answered", 2: "answered", 3: "answered", 4: "answered", 5: "answered",
    6: "answered", 7: "answered", 8: "answered", 9: "answered", 10: "answered",
    11: "answered", 12: "answered", 13: "answered", 14: "answered", 15: "answered",
    16: "skipped", 17: "answered", 18: "marked", 19: "answered", 20: "not_visited"
  });

  const [timeLeft, setTimeLeft] = useState(10727); 
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    const currentQId = questions[currentIndex].id;
    if (questionStatuses[currentQId] === "not_visited") {
      setQuestionStatuses(prev => ({ ...prev, [currentQId]: "skipped" }));
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeQuestion = questions[currentIndex];
  const activeSection = activeQuestion.section;

  const setSection = (section: "physics" | "mathematics") => {
    const firstQIndex = questions.findIndex(q => q.section === section);
    if (firstQIndex !== -1) {
      setCurrentIndex(firstQIndex);
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    const qId = activeQuestion.id;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleClear = () => {
    const qId = activeQuestion.id;
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setQuestionStatuses(prev => ({ ...prev, [qId]: "skipped" }));
  };

  const handleSkip = () => {
    const qId = activeQuestion.id;
    setQuestionStatuses(prev => ({ ...prev, [qId]: "skipped" }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleMarkAndNext = () => {
    const qId = activeQuestion.id;
    setQuestionStatuses(prev => ({ ...prev, [qId]: "marked" }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSaveAndNext = () => {
    const qId = activeQuestion.id;
    if (selectedAnswers[qId] !== undefined) {
      setQuestionStatuses(prev => ({ ...prev, [qId]: "answered" }));
    } else {
      setQuestionStatuses(prev => ({ ...prev, [qId]: "skipped" }));
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getStats = () => {
    let answered = 0;
    let skipped = 0;
    let marked = 0;
    let notAttempted = 0;

    questions.forEach(q => {
      const status = questionStatuses[q.id] || "not_visited";
      const hasAnswer = selectedAnswers[q.id] !== undefined;

      if (status === "answered" || (status !== "marked" && hasAnswer)) {
        answered++;
      } else if (status === "marked") {
        marked++;
      } else if (status === "skipped") {
        skipped++;
      } else {
        notAttempted++;
      }
    });

    return { answered, skipped, marked, notAttempted };
  };

  const currentStats = getStats();

  const handleSubmitTest = () => {
    let score = 0;
    let correct = 0;
    let wrong = 0;

    questions.forEach(q => {
      const userAns = selectedAnswers[q.id];
      if (userAns !== undefined) {
        if (userAns === q.correctAnswer) {
          correct++;
          score += 4;
        } else {
          wrong++;
          score -= 1;
        }
      }
    });

    const scaledScore = Math.max(0, score * 3.75); 

    onFinishTest({
      score: Math.round(scaledScore),
      totalQuestions: questions.length,
      answered: currentStats.answered,
      skipped: currentStats.skipped,
      marked: currentStats.marked,
      notAttempted: currentStats.notAttempted,
      correct,
      wrong
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white font-sans overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-[#0B1220] px-6 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-white">{testTitle}</h2>
          <p className="text-[10px] text-slate-400">Physics & Mathematics • 300 Marks • -1 per wrong MCQ answer</p>
        </div>
        
        {/* Timer Box */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-2xl border border-slate-700/60 font-mono text-xl font-bold tracking-widest text-white shadow-inner">
          <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Answered: <span className="font-bold text-emerald-400">{currentStats.answered}</span> / {questions.length}
          </div>
          <Button 
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0F172A] font-bold text-xs px-5 py-2.5 h-9 rounded-xl shadow-md transition-all cursor-pointer border-none"
          >
            SUBMIT TEST
          </Button>
        </div>
      </header>

      {/* Sections Tab Bar */}
      <nav className="flex h-12 shrink-0 items-center bg-[#1E293B] border-b border-slate-800/60 px-6 gap-2">
        <button 
          onClick={() => setSection("physics")}
          className={`flex items-center gap-2 h-full px-5 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeSection === "physics" 
              ? "border-amber-500 text-amber-500 bg-slate-800/40" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          ⚡ Physics 
          <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0.5 bg-slate-800 border-none text-slate-400 rounded-full font-bold">10/10</Badge>
        </button>
        <button 
          onClick={() => setSection("mathematics")}
          className={`flex items-center gap-2 h-full px-5 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeSection === "mathematics" 
              ? "border-amber-500 text-amber-500 bg-slate-800/40" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          ∑ Mathematics 
          <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0.5 bg-amber-500/10 border-none text-amber-400 rounded-full font-bold">7/10</Badge>
        </button>
      </nav>

      {/* Exam Body Layout */}
      <div className="flex flex-1 min-h-0 bg-slate-950">
        
        {/* Left Side: Question Area */}
        <ScrollArea className="flex-1 flex flex-col min-w-0 p-6">
          <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full space-y-6">
            
            {/* Question Card */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
              
              {/* Question Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/60 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-950 border border-indigo-500/30 text-indigo-400 font-black text-base">
                    Q {activeQuestion.id}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activeQuestion.topic}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                        {activeQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline" className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                        {activeQuestion.year}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
                    <Flag className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Question Statement */}
              <div className="py-8 text-slate-200 text-lg font-medium leading-relaxed flex-1 select-text">
                <p className="whitespace-pre-line">{activeQuestion.text}</p>
                {activeQuestion.id === 20 && (
                  <div className="mt-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 font-mono text-center text-2xl text-amber-400 tracking-wider">
                    (x + 1/x)<sup>8</sup>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-3 shrink-0">
                {activeQuestion.options.map((option, idx) => {
                  const optionLetters = ["A", "B", "C", "D"];
                  const isSelected = selectedAnswers[activeQuestion.id] === idx;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border font-medium transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                          : "bg-slate-950/50 hover:bg-slate-850 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold border transition-colors ${
                        isSelected 
                          ? "bg-amber-500 border-amber-500 text-slate-950" 
                          : "bg-slate-900 border-slate-700 text-slate-400"
                      }`}>
                        {optionLetters[idx]}
                      </div>
                      <span className="text-base">{option}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Bottom Actions Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800/60 rounded-2xl shrink-0">
              <div className="flex items-center gap-2">
                <Button 
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  variant="outline"
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button 
                  onClick={handleClear}
                  variant="ghost"
                  className="bg-slate-850 hover:bg-slate-805 text-slate-300 hover:text-white font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Clear
                </Button>
                <Button 
                  onClick={handleMarkAndNext}
                  className="bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-purple-800/40 transition-all cursor-pointer"
                >
                  Mark & Next
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleSkip}
                  className="bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 font-bold text-xs py-3.5 px-5 h-11 rounded-xl border border-amber-950/40 transition-all cursor-pointer"
                >
                  Skip →
                </Button>
                <Button 
                  onClick={handleSaveAndNext}
                  className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0F172A] font-extrabold text-xs py-3.5 px-6 h-11 rounded-xl shadow-md border-none transition-all cursor-pointer"
                >
                  Save & Next →
                </Button>
              </div>
            </div>

          </div>
        </ScrollArea>

        {/* Right Side: Question Palette Sidebar */}
        <aside className="w-80 border-l border-slate-800 bg-[#0B1220] flex flex-col justify-between p-6 overflow-y-auto shrink-0 select-none">
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Palette</h3>
              
              {/* Palette Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-4 text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-slate-950 border border-slate-800"></span>
                  <span>Current question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-emerald-500 border border-emerald-500"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-amber-500 border border-amber-500"></span>
                  <span>Skipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-purple-500 border border-purple-500 relative">
                    <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                  </span>
                  <span>Marked for review</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <span className="h-4 w-4 rounded bg-slate-800 border border-slate-700"></span>
                  <span>Not visited</span>
                </div>
              </div>
            </div>

            {/* Grid Sections */}
            <div className="space-y-5">
              {/* Physics Palette */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">⚡ Physics</span>
                  <Badge variant="secondary" className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border-none">10/10 answered</Badge>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {questions.slice(0, 10).map((q, idx) => {
                    const qId = q.id;
                    const status = questionStatuses[qId] || "not_visited";
                    const isCurrent = currentIndex === idx;
                    
                    let bgClass = "bg-slate-800 border-slate-700 text-slate-400";
                    if (isCurrent) bgClass = "bg-slate-950 border-amber-500 text-amber-500 ring-1 ring-amber-500";
                    else if (status === "answered") bgClass = "bg-emerald-500 border-emerald-500 text-white font-bold";
                    else if (status === "marked") bgClass = "bg-purple-500 border-purple-500 text-white font-bold";
                    else if (status === "skipped") bgClass = "bg-amber-500 border-amber-500 text-white font-bold";

                    return (
                      <button 
                        key={qId} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-xl border flex items-center justify-center text-xs font-semibold relative transition-all duration-150 cursor-pointer ${bgClass}`}
                      >
                        {qId}
                        {status === "marked" && (
                          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mathematics Palette */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">∑ Mathematics</span>
                  <Badge variant="secondary" className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border-none">7/10 answered</Badge>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {questions.slice(10, 20).map((q, idx) => {
                    const actualIdx = idx + 10;
                    const qId = q.id;
                    const status = questionStatuses[qId] || "not_visited";
                    const isCurrent = currentIndex === actualIdx;
                    
                    let bgClass = "bg-slate-800 border-slate-700 text-slate-400";
                    if (isCurrent) bgClass = "bg-slate-950 border-indigo-400 text-indigo-400 ring-1 ring-indigo-400";
                    else if (status === "answered") bgClass = "bg-emerald-500 border-emerald-500 text-white font-bold";
                    else if (status === "marked") bgClass = "bg-purple-500 border-purple-500 text-white font-bold";
                    else if (status === "skipped") bgClass = "bg-amber-500 border-amber-500 text-white font-bold";

                    return (
                      <button 
                        key={qId} 
                        onClick={() => setCurrentIndex(actualIdx)}
                        className={`h-9 rounded-xl border flex items-center justify-center text-xs font-semibold relative transition-all duration-150 cursor-pointer ${bgClass}`}
                      >
                        {qId}
                        {status === "marked" && (
                          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary Footer */}
          <div className="border-t border-slate-800/80 pt-4 mt-6 text-slate-400 text-xs font-semibold space-y-1.5">
            <div className="flex justify-between">
              <span>Answered</span>
              <span className="text-white">{currentStats.answered}</span>
            </div>
            <div className="flex justify-between">
              <span>Skipped</span>
              <span className="text-white">{currentStats.skipped}</span>
            </div>
            <div className="flex justify-between">
              <span>Marked for review</span>
              <span className="text-white">{currentStats.marked}</span>
            </div>
            <div className="flex justify-between">
              <span>Not attempted</span>
              <span className="text-white">{currentStats.notAttempted}</span>
            </div>
          </div>

        </aside>

      </div>

      {/* Submit Test Dialog Overlay */}
      {isSubmitModalOpen && (
        <SubmitModal 
          stats={currentStats}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={handleSubmitTest}
        />
      )}

    </div>
  );
}
