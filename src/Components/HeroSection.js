import React from "react";

// Hero Section
export function HeroSection({ children }) {
  return (
    <div className="grid place-content-center place-items-center gap-24">
      <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:text-4xl">
        Welcome to <span className="text-primary">QuizZ</span>, Your Gateway to
        Knowledge and Fun!
      </h1>
      {children}
    </div>
  );
}
