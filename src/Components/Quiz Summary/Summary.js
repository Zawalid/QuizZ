
export function Summary({
  totalQuestions,
  correctQuestions,
  incorrectQuestions,
  unAnsweredQuestions,
  score,
  quizTime,
}) {
  const { quizTimeHours, quizTimeMinutes, quizTimeSeconds } = getTime(quizTime);

  return (
    <div className="flex w-4/5 flex-col gap-5 rounded-2xl bg-light-secondary p-8 dark:bg-dark-secondary max-md:w-full">
      <div className="mb-6 flex justify-between">
        <h3 className="text-3xl font-bold text-light-text dark:text-dark-text">
          Your Score
        </h3>
        <span className="text-3xl font-bold text-light-text dark:text-dark-text">
          {score}%
        </span>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Total Questions
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          {totalQuestions}
        </span>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Correct
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          {correctQuestions}
        </span>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Incorrect
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          {incorrectQuestions}
        </span>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Unanswered
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          {unAnsweredQuestions}
        </span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <i className="fa-solid fa-hourglass-start  text-2xl text-light-text-2 dark:text-dark-text-2"></i>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          {`${quizTimeHours > 0 ? quizTimeHours + "h" : ""} ${
            quizTimeMinutes > 0 ? quizTimeMinutes + "h" : ""
          } ${quizTimeSeconds}s`}
        </span>
        <i className="fa-solid fa-hourglass-end  text-2xl text-light-text-2 dark:text-dark-text-2"></i>
      </div>
    </div>
  );
}

export function getTime(quizTime) {
  const quizTimeHours =
    quizTime / 60 / 60 >= 1 ? Math.round(quizTime / 60 / 60) : 0;
  const quizTimeMinutes = quizTime / 60 >= 1 ? Math.round(quizTime / 60) : 0;
  const quizTimeSeconds = Math.round(quizTime % 60);

  return { quizTimeHours, quizTimeMinutes, quizTimeSeconds };
}

