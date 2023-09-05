import React from "react";
import { ActionButtons, Button } from "./App";
import { getTime } from "./Summary";

export function QuizHistory({ quizHistory }) {
  return (
    <>
      <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:w-full max-md:text-4xl">
        Quiz History
      </h1>
      <div className="table_container w-full overflow-x-auto">
        <table className="w-full table-auto  border-collapse rounded-xl bg-light-secondary  dark:bg-dark-secondary">
          <thead className="text-light-text-2  dark:text-dark-text-2 ">
            <tr className="text-center">
              <th className="border-r border-light-text-2   px-8 py-3 dark:border-dark-text-2">
                Quiz Number
              </th>
              <th className="border-r border-light-text-2  px-8 py-3 dark:border-dark-text-2">
                Total Questions
              </th>
              <th className="border-r border-light-text-2  px-8 py-3 dark:border-dark-text-2">
                Correct Answers
              </th>
              <th className="border-r border-light-text-2  px-8 py-3 dark:border-dark-text-2">
                Incorrect Answers
              </th>
              <th className="border-r border-light-text-2  px-8 py-3 dark:border-dark-text-2">
                Unanswered Questions
              </th>
              <th className="border-r border-light-text-2  px-8 py-3 dark:border-dark-text-2">
                Score
              </th>
              <th className="px-8 p-3">Time</th>
            </tr>
          </thead>
          <tbody className="text-light-text  dark:text-dark-text ">
            {quizHistory.map((quiz, index) => (
              <TableRow key={index + 22} index={index} quiz={quiz} />
            ))}
          </tbody>
        </table>
      </div>
      <ActionButtons>
        <Button>
          <i className="fa-solid fa-home mr-2 text-xl"></i> Home Page
        </Button>
        <Button>
          <i className="fa-solid fa-redo-alt mr-2 text-xl"></i> Try Again
        </Button>
      </ActionButtons>
    </>
  );
}
function TableRow({ quiz, index }) {
  const {
    totalQuestions,
    correctQuestions,
    incorrectQuestions,
    unAnsweredQuestions,
    score,
    quizTime,
  } = quiz;
  const { quizTimeHours, quizTimeMinutes, quizTimeSeconds } = getTime(quizTime);
  return (
    <tr className="text-center ">
      <td className="border-r border-t border-light-text-2  p-3  dark:border-dark-text-2">
        {index + 1}
      </td>
      <td className="border-r border-t border-light-text-2  p-3  dark:border-dark-text-2">
        {totalQuestions}
      </td>
      <td className="border-r border-t border-light-text-2  p-3  dark:border-dark-text-2">
        {correctQuestions}
      </td>
      <td className="border-r border-t border-light-text-2  p-3  dark:border-dark-text-2">
        {incorrectQuestions}
      </td>
      <td className="border-r border-t border-light-text-2  p-3  dark:border-dark-text-2">
        {unAnsweredQuestions}
      </td>
      <td className="border-r border-t border-light-text-2  p-3  dark:border-dark-text-2">
        {score}%
      </td>
      <td className="border-t border-light-text-2  p-3  dark:border-dark-text-2">
        {quizTimeHours > 10 ? quizTimeHours : `0${quizTimeHours} : `} 
        {quizTimeMinutes > 10 ? quizTimeMinutes : `0${quizTimeMinutes} : `} 
        {quizTimeSeconds > 10 ? quizTimeSeconds : `0${quizTimeSeconds}`}
      </td>
    </tr>
  );
}
