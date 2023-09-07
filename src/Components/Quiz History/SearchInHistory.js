export function SearchInHistory({ searchQuery, onChange }) {
  return (
    <div className="relative w-full">
      <i className="fas fa-search absolute left-3 top-3 text-light-text-2 dark:text-dark-text-2"></i>
      <input
        type="text"
        className="w-full rounded-lg bg-light-secondary py-2 pl-10  text-light-text placeholder:font-semibold  focus:outline-none dark:bg-dark-secondary dark:text-dark-text"
        placeholder="Search by quiz number"
        value={searchQuery}
        onChange={onChange} />
    </div>
  );
}
