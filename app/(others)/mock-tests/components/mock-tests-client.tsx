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
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedTestTitle, setSelectedTestTitle] = useState("");
  const [activeAttemptId, setActiveAttemptId] = useState("");
  const [testResults, setTestResults] = useState<any>(null);

  const handleStartTest = (testId: string, testTitle: string) => {
    setSelectedTestId(testId);
    setSelectedTestTitle(testTitle);
    setStep("instructions");
  };

  const handleBeginTest = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setStep("exam");
  };

  const handleFinishTest = (results: typeof testResults) => {
    setTestResults(results);
    setStep("results");
  };



  switch (step) {
    case "instructions":
      return (
        <InstructionsStep
          testId={selectedTestId}
          testTitle={selectedTestTitle}
          onBack={() => setStep("dashboard")}
          onBeginTest={handleBeginTest}
        />
      );
    case "exam":
      return (
        <ExamStep
          testId={selectedTestId}
          attemptId={activeAttemptId}
          testTitle={selectedTestTitle}
          onFinishTest={handleFinishTest}
        />
      );
    case "results":
      return testResults ? (
        <ResultsStep
          testTitle={selectedTestTitle}
          results={testResults}
          onBackToDashboard={() => setStep("dashboard")}
        />
      ) : (
        <DashboardStep onStartTest={handleStartTest} />
      );
    case "dashboard":
    default:
      return <DashboardStep onStartTest={handleStartTest} />;
  }
}
