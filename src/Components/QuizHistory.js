import React from "react";
import { getTime } from "./Summary";

export function QuizHistory({ quizHistory, children }) {
  return (
    <>
      {quizHistory.length === 0 ? (
        <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:w-full max-md:text-4xl">
          No Quiz History
        </h1>
      ) : (
        <>
          <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:w-full max-md:text-4xl">
            Quiz History
          </h1>
          <div className="table_container max-h-[550px] w-full overflow-x-auto rounded-xl">
            <table className="w-full table-auto  border-collapse bg-light-secondary  dark:bg-dark-secondary">
              <thead className="sticky top-0 bg-light-secondary text-light-text-2  dark:bg-dark-secondary  dark:text-dark-text-2">
                <tr className="text-center">
                  <th className=" p-3 ">Quiz Number</th>
                  <th className=" p-3 ">Total Questions</th>
                  <th className=" p-3 ">Correct </th>
                  <th className=" p-3 ">Incorrect </th>
                  <th className=" p-3 ">Unanswered</th>
                  <th className=" p-3 ">Score</th>
                  <th className=" p-3 px-8 ">Time</th>
                </tr>
              </thead>
              <tbody className="pt-5  text-light-text dark:text-dark-text">
                {quizHistory.map((quiz, index) => (
                  <TableRow key={index + 22} index={index} quiz={quiz} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {children}
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
      <td className="p-3">{index + 1}</td>
      <td className="p-3">{totalQuestions}</td>
      <td className="p-3">{correctQuestions}</td>
      <td className="p-3">{incorrectQuestions}</td>
      <td className="p-3">{unAnsweredQuestions}</td>
      <td className="p-3">{score}%</td>
      <td className="p-3">
        {quizTimeHours > 10 ? quizTimeHours : `0${quizTimeHours} : `}
        {quizTimeMinutes > 10 ? quizTimeMinutes : `0${quizTimeMinutes} : `}
        {quizTimeSeconds > 10 ? quizTimeSeconds : `0${quizTimeSeconds}`}
      </td>
    </tr>
  );
}
