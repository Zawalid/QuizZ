export function Pagination({
  currentPage, onNextPage, onPreviousPage, rowsPerPage, quizHistoryLength, onChangeRowsPerPage, disabledButton,
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center  gap-2">
        <span className="text-sm text-light-text-2 dark:text-dark-text-2">
          Rows per page:
        </span>
        <select
          className="rounded-lg border-none bg-light-secondary px-3 py-1.5 text-sm text-light-text-2 focus:outline-none dark:bg-dark-secondary dark:text-dark-text-2"
          value={rowsPerPage}
          onChange={onChangeRowsPerPage}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">50</option>
        </select>
        <span className="flex gap-1 text-sm text-light-text-2 dark:text-dark-text-2">
          <span className="font-semibold text-light-text dark:text-dark-text">
            {currentPage}
          </span>
          of
          <span className="font-semibold text-light-text dark:text-dark-text">
            {Math.ceil(quizHistoryLength / rowsPerPage)}
          </span>
        </span>
      </div>

      <div className="flex items-center">
        <button
          className={"ml-0 flex h-full items-center justify-center rounded-l-lg  bg-light-secondary px-3 py-1.5 text-light-text    dark:bg-dark-secondary  dark:text-dark-text  " +
            (disabledButton === "previous"
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-primary hover:text-white dark:hover:bg-primary")}
          onClick={onPreviousPage}
        >
          Previous
        </button>

        <button
          className={"ml-0 flex h-full items-center justify-center rounded-r-lg  bg-light-secondary px-3 py-1.5 text-light-text    dark:bg-dark-secondary  dark:text-dark-text  " +
            (disabledButton === "next"
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-primary hover:text-white dark:hover:bg-primary")}
          onClick={onNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
