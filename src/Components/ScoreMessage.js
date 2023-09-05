import React from "react";

export function ScoreMessage({ score }) {
  const scoreMessages = [
    { maxScore: 20, message: "Stay curious, keep learning!" },
    { maxScore: 40, message: "Progress is progress! Keep it up." },
    { maxScore: 60, message: "You're on the right track, keep going!" },
    { maxScore: 80, message: "Impressive work, keep challenging yourself!" },
    { maxScore: 100, message: "Fantastic! You've mastered this quiz!" },
  ];
  return (
    <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:w-full max-md:text-4xl">
      {scoreMessages.find(
        (scoreMessage) => score <= scoreMessage.maxScore
      ).message}
    </h1>
  );
}
