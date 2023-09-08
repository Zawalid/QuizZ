export const scoreRanges = [
  { label: "All Scores", min: 0, max: 100 },
  { label: "0 - 20", min: 0, max: 20 },
  { label: "21 - 40", min: 21, max: 40 },
  { label: "41 - 60", min: 41, max: 60 },
  { label: "61 - 80", min: 61, max: 80 },
  { label: "81 - 100", min: 81, max: 100 },
];

export function FilterHistory({ selectedRange, onSelect, onFilter }) {
  return (
    <div className="flex items-center justify-center gap-3 ">
      <div className="relative w-full">
        <i className="fas fa-filter absolute left-3 top-3 text-light-text-2 dark:text-dark-text-2"></i>
        <select
          className="w-full rounded-lg bg-light-secondary px-10 py-2 text-light-text focus:outline-none cursor-pointer dark:bg-dark-secondary dark:text-dark-text
    "
          value={selectedRange}
          onChange={onSelect}
        >
          {scoreRanges.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>
       
      </div>
      <button
        className="rounded-lg bg-light-secondary px-4 py-2 text-light-text dark:bg-dark-secondary dark:text-dark-text"
        onClick={onFilter}
      >
        Filter
      </button>
    </div>
  );
}
