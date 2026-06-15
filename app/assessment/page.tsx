"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import ProgressBar from "@/components/assessment/ProgressBar";
import QuestionCard from "@/components/assessment/QuestionCard";
import ModuleComplete from "@/components/assessment/ModuleComplete";
import ScoreGate from "@/components/assessment/ScoreGate";
import { QUESTIONS, MODULES } from "@/lib/questions";
import { calculateResult, type ModuleScores } from "@/lib/assessment";

type Phase = "question" | "module-complete" | "score-gate";

export default function AssessmentPage() {
  const router = useRouter();
  const plausible = usePlausible();

  const [currentQ, setCurrentQ] = useState(0); // 0-indexed
  const [phase, setPhase] = useState<Phase>("question");
  const [completedModule, setCompletedModule] = useState<{ name: string; score: number; max: number } | null>(null);
  const [moduleScores, setModuleScores] = useState<ModuleScores>({
    chatbot: 0,
    automation: 0,
  });
  const [totalScore, setTotalScore] = useState(0);
  const [animating, setAnimating] = useState(false);

  const question = QUESTIONS[currentQ];
  const questionNumber = currentQ + 1;

  // Fire AssessmentStarted on Q1
  useEffect(() => {
    if (currentQ === 0) {
      plausible("AssessmentStarted");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (points: number) => {
    const newScores = { ...moduleScores };
    newScores[question.module] += points;
    setModuleScores(newScores);

    const isLastQuestion = currentQ === QUESTIONS.length - 1;
    const isLastInModule =
      MODULES.find((m) => m.key === question.module)?.questions.at(-1) === questionNumber;

    if (isLastQuestion) {
      // Fire event
      plausible("AssessmentCompleted");
      const result = calculateResult(newScores);
      setTotalScore(result.totalScore);
      setModuleScores(newScores);
      setPhase("score-gate");
      return;
    }

    if (isLastInModule) {
      const mod = MODULES.find((m) => m.key === question.module)!;
      setCompletedModule({
        name: mod.name,
        score: newScores[mod.key],
        max: 50,
      });
      setPhase("module-complete");
      setTimeout(() => {
        setPhase("question");
        setCurrentQ((prev) => prev + 1);
        setCompletedModule(null);
      }, 2000);
      return;
    }

    // Animate to next question
    setAnimating(true);
    setTimeout(() => {
      setCurrentQ((prev) => prev + 1);
      setAnimating(false);
    }, 220);
  };

  const handleUnlock = async (name: string, email: string, revenue: string) => {
    plausible("ScoreGateSubmitted");

    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          revenue,
          scores: moduleScores,
          totalScore,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Still proceed — lead capture failure shouldn't block the user
    }

    const params = new URLSearchParams({ scores: JSON.stringify(moduleScores) });
    router.push(`/report?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Progress bar */}
      {phase !== "score-gate" && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-canvas pt-4 pb-2">
          <ProgressBar
            current={questionNumber}
            total={QUESTIONS.length}
            moduleName={`Module ${MODULES.findIndex((m) => m.key === question.module) + 1}: ${question.moduleName}`}
          />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-12">
        <div style={{ maxWidth: 620, width: "100%" }}>
          {phase === "question" && question && (
            <div
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? "translateX(-20px)" : "translateX(0)",
                transition: "opacity 220ms ease, transform 220ms ease",
              }}
            >
              <QuestionCard question={question} onAnswer={handleAnswer} />
            </div>
          )}

          {phase === "module-complete" && completedModule && (
            <ModuleComplete
              moduleName={completedModule.name}
              score={completedModule.score}
              max={completedModule.max}
            />
          )}

          {phase === "score-gate" && (
            <ScoreGate totalScore={totalScore} onUnlock={handleUnlock} />
          )}
        </div>
      </div>
    </div>
  );
}
