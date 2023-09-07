import {useState} from "react";

const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 14, name: "Entertainment: Television" },
  { id: 12, name: "Entertainment: Music" },
  { id: 17, name: "Science & Nature" },
  { id: 15, name: "Entertainment: Video Games" },
  { id: 11, name: "Entertainment: Film" },
  { id: 22, name: "Geography" },
  { id: 31, name: "Entertainment: Japanese Anime & Manga" },
  { id: 18, name: "Science: Computers" },
  { id: 21, name: "Sports" },
  { id: 23, name: "History" },
];
export const defaultSettings = {
  category: "any",
  difficulty: "any",
  questionsNumber: 10,
  type: "any",
  easyTime: 10,
  mediumTime: 15,
  hardTime: 20,
  autoStartTimer: true,
  enableCorrectAnswerSound: true,
  enableIncorrectAnswerSound: true,
  enableTimerSound: false,
};
export function Settings({
  children,
  active,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  questionsNumber,
  setQuestionsNumber,
  type,
  setType,
  easyTime,
  setEasyTime,
  mediumTime,
  setMediumTime,
  hardTime,
  setHardTime,
  autoStartTimer,
  setAutoStartTimer,
  enableCorrectAnswerSound,
  setEnableCorrectAnswerSound,
  enableIncorrectAnswerSound,
  setEnableIncorrectAnswerSound,
  enableTimerSound,
  setEnableTimerSound,
  onClearQuizHistory,
}) {
  const [isQuizHistoryCleared, setIsQuizHistoryCleared] = useState(false);
  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center bg-light-background pb-5 pt-24 dark:bg-dark-background  " +
        (active ? "z-10 opacity-100" : "-z-10 opacity-0")
      }
    >
      <div className="flex h-full w-3/4 flex-col justify-between gap-5 max-md:w-full max-md:px-4">
        <h1 className="text-start  text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:text-4xl">
          Settings
        </h1>
        <div className="h-auto overflow-y-auto py-5 pe-5">
          <h2 className="mb-8 text-2xl font-bold text-light-text-2 dark:text-dark-text-2">
            Quiz Options
          </h2>
          <form className="grid w-full grid-cols-[1fr_300px] gap-6 ps-5 max-sm:grid-cols-[1fr_minmax(150px,300px)]">
            <label className="text-xl font-bold text-light-text dark:text-dark-text">
              Category
            </label>
            <select
              className="cursor-pointer rounded-lg bg-light-secondary px-5 py-2 text-center text-xl font-bold text-light-text focus:outline-none dark:bg-dark-secondary dark:text-dark-text max-md:text-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="any">Any Category</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label className="text-xl font-bold text-light-text dark:text-dark-text max-md:text-lg">
              Difficulty
            </label>
            <select
              className="cursor-pointer rounded-lg bg-light-secondary px-5 py-2 text-center text-xl font-bold text-light-text focus:outline-none dark:bg-dark-secondary dark:text-dark-text max-md:text-lg "
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="any">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <label className="text-xl font-bold text-light-text dark:text-dark-text max-md:text-lg">
              Questions Number
            </label>
            <select
              className="cursor-pointer rounded-lg bg-light-secondary px-5 py-2 text-center text-xl font-bold text-light-text focus:outline-none dark:bg-dark-secondary dark:text-dark-text max-md:text-lg "
              value={questionsNumber}
              onChange={(e) => setQuestionsNumber(e.target.value)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>

            <label className="text-xl font-bold text-light-text dark:text-dark-text max-md:text-lg">
              Type
            </label>
            <select
              className="cursor-pointer rounded-lg bg-light-secondary px-5 py-2 text-center text-xl font-bold text-light-text focus:outline-none dark:bg-dark-secondary dark:text-dark-text max-md:text-lg "
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="any">Any Type</option>
              <option value="multiple">Multiple Choices</option>
              <option value="boolean">True / False</option>
            </select>
          </form>
          <h2 className="my-8 text-2xl font-bold text-light-text-2 dark:text-dark-text-2">
            Timer Options
          </h2>
          <form className=" w-full gap-6 ps-5">
            <label className="text-xl font-bold text-light-text dark:text-dark-text">
              Timer Duration{" "}
              <span className="text-sm text-light-text-2 dark:text-dark-text-2">
                (in secondes)
              </span>
            </label>
            <div className="my-6 grid grid-cols-3 gap-5 ps-3">
              <label className="text-center text-lg font-bold text-light-text dark:text-dark-text">
                Easy Questions
              </label>
              <label className="text-center text-lg font-bold text-light-text dark:text-dark-text">
                Medium Questions
              </label>
              <label className="text-center text-lg font-bold text-light-text dark:text-dark-text">
                Hard Questions
              </label>

              <input
                type="number"
                min={5}
                max={60}
                value={easyTime}
                onChange={(e) =>
                  setEasyTime(e.target.value > 60 ? 60 : e.target.value)
                }
                className="rounded-lg bg-light-secondary px-5 py-2 text-center text-xl font-bold text-light-text focus:outline-none dark:bg-dark-secondary dark:text-dark-text "
              />
              <input
                type="number"
                min={10}
                max={90}
                value={mediumTime}
                onChange={(e) =>
                  setMediumTime(e.target.value > 90 ? 90 : e.target.value)
                }
                className="rounded-lg bg-light-secondary px-5 py-2 text-center text-xl font-bold text-light-text focus:outline-none dark:bg-dark-secondary dark:text-dark-text "
              />
              <input
                type="number"
                min={20}
                max={120}
                value={hardTime}
                onChange={(e) =>
                  setHardTime(e.target.value > 120 ? 120 : e.target.value)
                }
                className="rounded-lg bg-light-secondary px-5 py-2 text-center text-xl font-bold text-light-text focus:outline-none dark:bg-dark-secondary dark:text-dark-text "
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xl font-bold text-light-text dark:text-dark-text">
                Auto Start Timer
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox peer absolute appearance-none"
                  checked={autoStartTimer}
                  onChange={(e) => setAutoStartTimer(e.target.checked)}
                />
                <div
                  className="toggle-switch relative h-9 w-16
              cursor-pointer rounded-[20px] bg-light-secondary transition-colors duration-300 before:absolute
              before:left-[5px] before:top-1 before:h-7 before:w-7 before:rounded-full before:bg-light-text before:transition-[left] before:duration-300
              peer-checked:bg-primary peer-checked:before:left-8 
              peer-checked:before:bg-white dark:bg-dark-secondary dark:before:bg-dark-text
              "
                ></div>
              </label>
            </div>
          </form>
          <h2 className="my-8 text-2xl font-bold text-light-text-2 dark:text-dark-text-2">
            Sound Options
          </h2>
          <form className=" w-full gap-6 ps-5">
            <div className="flex items-center justify-between">
              <label className="text-xl font-bold  text-light-text dark:text-dark-text max-md:text-lg">
                Correct Answer Sound
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox peer absolute appearance-none"
                  checked={enableCorrectAnswerSound}
                  onChange={(e) =>
                    setEnableCorrectAnswerSound(e.target.checked)
                  }
                />
                <div
                  className="toggle-switch relative h-9 w-16
              cursor-pointer rounded-[20px] bg-light-secondary transition-colors duration-300 before:absolute
              before:left-[5px] before:top-1 before:h-7 before:w-7 before:rounded-full before:bg-light-text before:transition-[left] before:duration-300
              peer-checked:bg-primary peer-checked:before:left-8 
              peer-checked:before:bg-white dark:bg-dark-secondary dark:before:bg-dark-text
              "
                ></div>
              </label>
            </div>
            <div className="my-6 flex items-center justify-between">
              <label className="text-xl font-bold  text-light-text dark:text-dark-text max-md:text-lg">
                Incorrect Answer Sound
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox peer absolute appearance-none"
                  checked={enableIncorrectAnswerSound}
                  onChange={(e) =>
                    setEnableIncorrectAnswerSound(e.target.checked)
                  }
                />
                <div
                  className="toggle-switch relative h-9 w-16
              cursor-pointer rounded-[20px] bg-light-secondary transition-colors duration-300 before:absolute
              before:left-[5px] before:top-1 before:h-7 before:w-7 before:rounded-full before:bg-light-text before:transition-[left] before:duration-300
              peer-checked:bg-primary peer-checked:before:left-8 
              peer-checked:before:bg-white dark:bg-dark-secondary dark:before:bg-dark-text
              "
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xl font-bold  text-light-text dark:text-dark-text max-md:text-lg">
                Timer Sound
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox peer absolute appearance-none"
                  checked={enableTimerSound}
                  onChange={(e) => setEnableTimerSound(e.target.checked)}
                />
                <div
                  className="toggle-switch relative h-9 w-16
              cursor-pointer rounded-[20px] bg-light-secondary transition-colors duration-300 before:absolute
              before:left-[5px] before:top-1 before:h-7 before:w-7 before:rounded-full before:bg-light-text before:transition-[left] before:duration-300
              peer-checked:bg-primary peer-checked:before:left-8 
              peer-checked:before:bg-white dark:bg-dark-secondary dark:before:bg-dark-text
              "
                ></div>
              </label>
            </div>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
