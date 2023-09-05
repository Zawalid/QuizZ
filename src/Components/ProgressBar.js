import React from "react";

export function ProgressBar({ totalQuestions, currentQuestion }) {
  const percentage = Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  return (
    <div
      className="flex w-full items-center gap-3
    "
    >
      <div className="relative h-[5px] w-full rounded-lg bg-light-secondary  dark:bg-dark-secondary">
        <div
          className="absolute inset-0  rounded-lg bg-primary transition-[width] duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <Progress
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion} />
    </div>
  );
}
function Progress({ totalQuestions, currentQuestion }) {
  return (
    <span className="text-lg font-bold text-light-text dark:text-dark-text">
      {currentQuestion + 1}/{totalQuestions}
    </span>
  );
}
