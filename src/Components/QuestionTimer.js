import React from "react";

export function QuestionTimer({ questionTime, isTimerPaused, onPause }) {
  let minutes = Math.floor(questionTime / 60);
  let seconds = questionTime % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return (
    <div className="flex  w-24 items-center gap-3 rounded-xl bg-light-secondary px-3 py-2 dark:bg-dark-secondary ">
      <i
        className={"fa-solid " +
          `fa-${isTimerPaused ? "play" : "pause"}` +
          " cursor-pointer text-xl text-light-text dark:text-dark-text"}
        onClick={onPause}
      ></i>
      <span className="text-lg font-bold text-light-text dark:text-dark-text">
        {minutes}:{seconds}
      </span>
    </div>
  );
}
