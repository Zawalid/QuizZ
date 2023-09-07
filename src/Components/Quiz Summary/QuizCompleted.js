import React, { useEffect } from "react";
import { Summary } from "./Summary";
import { ScoreMessage } from "./ScoreMessage";

// Quiz completed section
export function QuizCompleted({
  children,
  totalQuestions,
  correctQuestions,
  unAnsweredQuestions,
  quizTime,
  onCompleted,
}) {
  const incorrectQuestions =
    totalQuestions - correctQuestions - unAnsweredQuestions;
  const score = Math.round((correctQuestions / totalQuestions) * 100);

  useEffect(() => {
    onCompleted({
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      unAnsweredQuestions,
      score,
      quizTime,
    });
  }, []);

  return (
    <>
      <ScoreMessage score={score} />
      <Summary
        totalQuestions={totalQuestions}
        correctQuestions={correctQuestions}
        incorrectQuestions={incorrectQuestions}
        unAnsweredQuestions={unAnsweredQuestions}
        score={score}
        quizTime={quizTime}
      />
      {children}
    </>
  );
}
