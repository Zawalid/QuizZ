import React, { useState } from "react";

export function AnswersList({ children }) {
  return (
    <div className="flex w-full items-center max-md:flex-col max-md:gap-5">
      {children[0]}
      <div className="flex flex-1 flex-col items-center gap-5 max-md:w-full">
        {children[1]}
      </div>
      {children[2]}
    </div>
  );
}
export function Answer({
  children = "something went wrong", onAnswer, correctAnswer, isAnswered, isHintUsed,
}) {
  const correct = children === correctAnswer;
  const [isCurrentAnswer, setIsCurrentAnswer] = useState(false);
  return (
    <button
      className={"flex w-3/4 cursor-pointer items-center justify-between rounded-xl px-5 py-3 text-start text-lg font-bold max-md:w-full  " +
        ((isAnswered || isHintUsed) && correct
          ? "bg-light-correct text-white dark:bg-dark-correct"
          : isCurrentAnswer && !correct
            ? "bg-light-incorrect text-white dark:bg-dark-incorrect"
            : "bg-light-secondary text-light-text-2 dark:bg-dark-secondary dark:text-dark-text-2 ")}
      onClick={() => {
        if (!isAnswered) {
          onAnswer(children);
          setIsCurrentAnswer(true);
        }
      }}
    >
      {children}
      {isAnswered && correct ? (
        <i className="fa-regular fa-circle-check text-2xl text-white"></i>
      ) : (
        isHintUsed &&
        correct && (
          <i className="fa-regular fa-lightbulb text-2xl text-white"></i>
        )
      )}
      {isCurrentAnswer && !correct && (
        <i className="fa-regular fa-circle-xmark text-2xl text-white"></i>
      )}
    </button>
  );
}
