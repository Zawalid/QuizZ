import { useEffect, useRef, useState } from "react";
import { getTime } from "./Summary";
import { Pagination } from "./Pagination";

export function QuizHistory({ quizHistory, children }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [disabledButton, setDisabledButton] = useState(null);
  const theadElement = useRef(null);
  const [sortKey, setSortKey] = useState("quizNumber");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (currentPage * rowsPerPage >= quizHistory.length) {
      setDisabledButton("next");
    } else if (currentPage === 1) {
      setDisabledButton("previous");
    }
    return () => setDisabledButton(null);
  }, [currentPage, rowsPerPage, quizHistory]);
  useEffect(() => {
    const thead = theadElement.current;
    function callback(e) {
      if (e.target.tagName === "BUTTON") {
        thead.querySelectorAll("i").forEach((icon) => {
          icon.classList.add("hidden");
        });
        e.target.children[0].classList.remove("hidden");
        
        sortDirection === "asc"
          ? e.target.children[0].classList.replace("fa-sort-up", "fa-sort-down")
          : e.target.children[0].classList.replace("fa-sort-down", "fa-sort-up");

        setSortKey(e.target.dataset.key);
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      }
    }
    thead.addEventListener("click", callback);
    return () => thead.removeEventListener("click", callback);
  }, [theadElement,sortDirection]);

  function handleNextPage() {
    currentPage * rowsPerPage >= quizHistory.length ||
      setCurrentPage(currentPage + 1);
  }
  function handlePreviousPage() {
    currentPage === 1 || setCurrentPage(currentPage - 1);
  }
  function handleRowsPerPageChange(e) {
    setRowsPerPage(e.target.value);
    setCurrentPage(1);
  }

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
          <div className="w-full">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"></div>
            <div className="table_container max-h-[550px] w-full overflow-x-auto rounded-xl">
              <table className="w-full table-auto  border-collapse bg-light-secondary  dark:bg-dark-secondary">
                <thead
                  className="sticky top-0 bg-light-secondary text-light-text-2  dark:bg-dark-secondary  dark:text-dark-text-2"
                  ref={theadElement}
                >
                  <tr className="text-center">
                    <th className=" p-3 ">
                      <button
                        className="inline-flex items-center justify-center gap-2"
                        data-key="quizNumber"
                      >
                        <i className="fa-solid fa-sort-up"></i>
                        Quiz Number
                      </button>
                    </th>
                    <th className=" p-3 ">
                      <button
                        className="inline-flex items-center justify-center gap-2"
                        data-key="totalQuestions"
                      >
                        <i className="fa-solid fa-sort-up  hidden"></i>
                        Total Questions
                      </button>
                    </th>
                    <th className=" p-3 ">
                      <button
                        className="inline-flex items-center justify-center gap-2"
                        data-key="correctQuestions"
                      >
                        <i className="fa-solid fa-sort-up  hidden"></i>
                        Correct
                      </button>
                    </th>
                    <th className=" p-3 ">
                      <button
                        className="inline-flex items-center justify-center gap-2"
                        data-key="incorrectQuestions"
                      >
                        <i className="fa-solid fa-sort-up  hidden"></i>
                        Incorrect
                      </button>
                    </th>
                    <th className=" p-3 ">
                      <button
                        className="inline-flex items-center justify-center gap-2"
                        data-key="unAnsweredQuestions"
                      >
                        <i className="fa-solid fa-sort-up  hidden"></i>
                        Unanswered
                      </button>
                    </th>
                    <th className=" p-3 ">
                      <button
                        className="inline-flex items-center justify-center gap-2"
                        data-key="score"
                      >
                        <i className="fa-solid fa-sort-up  hidden"></i>
                        Score
                      </button>
                    </th>
                    <th className=" p-3 ">
                      <button
                        className="inline-flex items-center justify-center gap-2"
                        data-key="quizTime"
                      >
                        <i className="fa-solid fa-sort-up  hidden"></i>
                        Time Taken
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="pt-5  text-light-text dark:text-dark-text">
                  {[
                    ...quizHistory
                      .slice(
                        (currentPage - 1) * rowsPerPage,
                        currentPage * rowsPerPage,
                      )
                      .sort((a, b) => {
                        if (sortDirection === "asc") {
                          return a[sortKey] - b[sortKey];
                        } else {
                          return b[sortKey] - a[sortKey];
                        }
                      }),
                  ].map((quiz, index) => (
                    <TableRow key={index + 22} quiz={quiz} />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              rowsPerPage={rowsPerPage}
              quizHistoryLength={quizHistory.length}
              onChangeRowsPerPage={handleRowsPerPageChange}
              disabledButton={disabledButton}
            />
          </div>
        </>
      )}
      {children}
    </>
  );
}
function TableRow({ quiz }) {
  const {
    totalQuestions,
    correctQuestions,
    incorrectQuestions,
    unAnsweredQuestions,
    score,
    quizTime,
    quizNumber,
  } = quiz;
  const { quizTimeHours, quizTimeMinutes, quizTimeSeconds } = getTime(quizTime);
  return (
    <tr className="text-center ">
      <td className="p-3">{quizNumber}</td>
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
