"use client";

import { useState } from "react";
import { 
  DashboardStep, 
  InstructionsStep, 
  ExamStep, 
  ResultsStep 
} from "./index";

export default function MockTestsClient() {
  const [step, setStep] = useState<"dashboard" | "instructions" | "exam" | "results">("dashboard");
  const [selectedTestTitle, setSelectedTestTitle] = useState("");
  const [testResults, setTestResults] = useState<{
    score: number;
    totalQuestions: number;
    answered: number;
    skipped: number;
    marked: number;
    notAttempted: number;
    correct: number;
    wrong: number;
  } | null>(null);

  const handleStartTest = (_testId: string, testTitle: string) => {
    setSelectedTestTitle(testTitle);
    setStep("instructions");
  };

  const handleBeginTest = () => {
    setStep("exam");
  };

  const handleFinishTest = (results: typeof testResults) => {
    setTestResults(results);
    setStep("results");
  };

  const handleBackToDashboard = () => {
    setStep("dashboard");
    setSelectedTestTitle("");
    setTestResults(null);
  };

  switch (step) {
    case "instructions":
      return (
        <InstructionsStep
          testTitle={selectedTestTitle}
          onBack={() => setStep("dashboard")}
          onBeginTest={handleBeginTest}
        />
      );
    case "exam":
      return (
        <ExamStep
          testTitle={selectedTestTitle}
          onFinishTest={handleFinishTest}
        />
      );
    case "results":
      return testResults ? (
        <ResultsStep
          testTitle={selectedTestTitle}
          results={testResults}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : (
        <DashboardStep onStartTest={handleStartTest} />
      );
    case "dashboard":
    default:
      return <DashboardStep onStartTest={handleStartTest} />;
  }
}
