import { useEffect, useRef, useState } from "react";
import { getTime } from "../Quiz Summary/Summary";
import { Pagination } from "./Pagination";
import { SearchInHistory } from "./SearchInHistory";
import { scoreRanges, FilterHistory } from "./FilterHistory";

export function QuizHistory({
  quizHistory,
  children,
  onRemoveFromQuizHistory,
  onClearQuizHistory,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [disabledButton, setDisabledButton] = useState(null);
  const theadElement = useRef(null);
  const [sortKey, setSortKey] = useState("quizNumber");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRange, setSelectedRange] = useState("All Scores");
  const [filteredHistory, setFilteredHistory] = useState(quizHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = useRef(Math.ceil(filteredHistory.length / rowsPerPage));

  useEffect(() => {
    currentPage * rowsPerPage >= filteredHistory.length &&
      setDisabledButton("next");
    currentPage === 1 && setDisabledButton("previous");
    currentPage * rowsPerPage >= filteredHistory.length &&
      currentPage === 1 &&
      setDisabledButton("both");

    return () => setDisabledButton(null);
  }, [currentPage, rowsPerPage, filteredHistory]);
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
          : e.target.children[0].classList.replace(
              "fa-sort-down",
              "fa-sort-up",
            );

        setSortKey(e.target.dataset.key);
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      }
    }
    thead?.addEventListener("click", callback);
    return () => thead?.removeEventListener("click", callback);
  }, [theadElement, sortDirection]);
  useEffect(() => {
    const searchResult = getSearchResult();
    setFilteredHistory(searchResult);
    handleFilter();
    /* eslint-disable-next-line */
  }, [searchQuery, quizHistory]);
  useEffect(() => {
    totalPages.current = Math.ceil(filteredHistory.length / rowsPerPage);
    currentPage > totalPages.current && handlePreviousPage();
    /* eslint-disable-next-line */
  }, [filteredHistory, rowsPerPage, currentPage]);

  function getSearchResult() {
    const searchResult = quizHistory.filter((quiz) => {
      return quiz.quizNumber.toString().includes(searchQuery);
    });
    return searchResult;
  }
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
  const handleFilter = () => {
    if (selectedRange === "All Scores") {
      setFilteredHistory(getSearchResult());
    } else {
      const { min, max } = scoreRanges.find(
        (range) => range.label === selectedRange,
      );
      const filteredResult = quizHistory.filter((quiz) => {
        return (
          quiz.score >= min &&
          quiz.score <= max &&
          quiz.quizNumber.toString().includes(searchQuery)
        );
      });
      setFilteredHistory(filteredResult);
    }
  };

  return (
    <>
      <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:w-full max-md:text-4xl">
        Quiz History
      </h1>
      {quizHistory.length === 0 ? (
        <div className="w-full rounded-xl bg-light-secondary px-5 py-10 dark:bg-dark-secondary">
          <h2 className="mb-5 text-center text-2xl font-bold text-light-text dark:text-dark-text">
            Your Quiz History is Empty
          </h2>
          <p className="text-center font-semibold text-light-text-2 dark:text-dark-text-2">
            Start a quiz to see your quiz history
          </p>
        </div>
      ) : (
        <div className="w-full ">
          <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
            <SearchInHistory
              searchQuery={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterHistory
              selectedRange={selectedRange}
              onSelect={(e) => setSelectedRange(e.target.value)}
              onFilter={handleFilter}
            />
            <button
              className="rounded-lg bg-light-incorrect px-4 py-2  font-bold  text-white dark:bg-dark-incorrect "
              onClick={onClearQuizHistory}
            >
              <i className="fa-solid fa-trash mr-3"></i> Clear History
            </button>
          </div>
          <div className="table_container max-h-[520px] w-full overflow-x-auto rounded-xl">
            <table className="w-full table-auto  border-collapse bg-light-secondary  dark:bg-dark-secondary">
              <thead
                className="sticky top-0 w-full bg-light-secondary text-light-text-2  dark:bg-dark-secondary  dark:text-dark-text-2"
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
                  <th></th>
                </tr>
              </thead>
              <tbody className="pt-5  text-light-text dark:text-dark-text">
                {filteredHistory
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
                  })
                  .map((quiz, index) => (
                    <TableRow
                      key={index + 22}
                      quiz={quiz}
                      onRemoveFromQuizHistory={onRemoveFromQuizHistory}
                    />
                  ))}
              </tbody>
            </table>
          </div>
          {filteredHistory.length === 0 ? (
            <p className="text-center text-light-text dark:text-dark-text mt-4 font-bold">
              No Quiz Found
            </p>
          ) : (
            <Pagination
              currentPage={currentPage}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              rowsPerPage={rowsPerPage}
              quizHistoryLength={filteredHistory.length}
              onChangeRowsPerPage={handleRowsPerPageChange}
              disabledButton={disabledButton}
            />
          )}
        </div>
      )}
      {children}
    </>
  );
}
function TableRow({ quiz, onRemoveFromQuizHistory }) {
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
      <td className="whitespace-nowrap p-3">
        {quizTimeHours >= 10 ? quizTimeHours : `0${quizTimeHours} : `}
        {quizTimeMinutes >= 10 ? quizTimeMinutes : `0${quizTimeMinutes} : `}
        {quizTimeSeconds >= 10 ? quizTimeSeconds : `0${quizTimeSeconds}`}
      </td>
      <td className="p-3">
        <button
          className="bg-light-primary dark:bg-dark-primary rounded-lg px-4 py-2 text-light-text dark:text-dark-text"
          onClick={() => onRemoveFromQuizHistory(quizNumber)}
        >
          <i className="fas fa-xmark text-lg text-light-text-2 dark:text-dark-text-2"></i>
        </button>
      </td>
    </tr>
  );
}
