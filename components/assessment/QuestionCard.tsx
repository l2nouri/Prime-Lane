"use client";

import { useState } from "react";
import AnswerOption from "./AnswerOption";
import type { Question } from "@/lib/questions";

export default function QuestionCard({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: (points: number, label: string) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (points: number, label: string, index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => {
      onAnswer(points, label);
      setSelected(null);
    }, 350);
  };

  return (
    <div className="w-full">
      <h2
        className="font-sans font-medium text-ink mb-8"
        style={{ fontSize: 22, maxWidth: 540, lineHeight: 1.35 }}
      >
        {question.text}
      </h2>
      <div className="flex flex-col gap-[10px]">
        {question.options.map((opt, i) => (
          <AnswerOption
            key={i}
            label={opt.label}
            selected={selected === i}
            onClick={() => handleSelect(opt.points, opt.label, i)}
          />
        ))}
      </div>
    </div>
  );
}
