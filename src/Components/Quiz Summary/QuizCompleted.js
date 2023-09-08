import { Summary } from "./Summary";
import { ScoreMessage } from "./ScoreMessage";

// Quiz completed section
export function QuizCompleted({
  children,
  totalQuestions,
  correctQuestions,
  unAnsweredQuestions,
  quizTime,
}) {
  const incorrectQuestions =
    totalQuestions - correctQuestions - unAnsweredQuestions;
  const score = Math.round((correctQuestions / totalQuestions) * 100);

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
