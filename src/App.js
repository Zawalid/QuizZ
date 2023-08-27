import { useState } from "react";
import he from "he";
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
const questionsSample = [
  "In past times, what would a gentleman keep in his fob pocket?",
  "When was &quot;YouTube&quot; founded?",
  "Which one of the following rhythm games was made by Harmonix?",
  "Which of these is the name of a Japanese system of…e, literally meaning &quot;finger pressure&quot;?",
  "What is the romanized Russian word for &quot;winter&quot;?",
  "What is the name of Poland in Polish?",
  "How tall is the Burj Khalifa?",
  "Where did the pineapple plant originate?",
  "When someone is inexperienced they are said to be what color?",
  "What is the French word for &quot;fish&quot;?",
];
const answersSample = [
  ["Money", "Keys", "Notebook", "Watch"],
  ["May 22, 2004", "September 12, 2005", "July 19, 2009", "February 14, 2005"],
  [
    "Meat Beat Mania",
    "Guitar Hero Live",
    "Dance Dance Revolution",
    "Rock Band",
  ],
  ["Ukiyo", "Majime", "Ikigai", "Shiatsu"],
  ["Leto", "Vesna", "Osen&#039;", "Zima"],
  ["Pupcia", "Polszka", "P&oacute;land", "Polska"],
  ["2,717 ft", "2,546 ft", "3,024 ft", "2,722 ft"],
  ["Hawaii", "Europe", "Asia", "South America"],
  ["Red", "Blue", "Yellow", "Green"],
  ["fiche", "escargot", "mer", "poisson"],
];
function Button({ children, onclick }) {
  return (
    <button
      className="px-5 py-2 w-40 font-bold text-lg cursor-pointer rounded-2xl bg-primary outline-primary text-white "
      onClick={onclick}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  function toggleSettings() {
    setSettingsOpen((so) => !so);
  }
  return (
    <div className="container mx-auto relative py-4 px-8 h-full grid grid-rows-[36px_1fr]">
      <Header>
        <SettingsButton onToggleSettings={toggleSettings} />
      </Header>
      <Quiz />
      <Settings active={settingsOpen} />
    </div>
  );
}
// Header
function Header({ children }) {
  return (
    <header className="flex justify-between items-center relative z-20">
      <h2 className="text-3xl font-bold text-primary">QuizZ</h2>
      <div className="flex gap-5">
        {children}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.theme || "light");
  function toggleTheme() {
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    setTheme((th) => (th === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark");
  }
  return (
    <button
      className="w-8 h-8 cursor-pointer rounded-lg bg-light-text dark:bg-dark-text grid place-content-center"
      onClick={toggleTheme}
    >
      <i
        className={`fa-solid fa-${
          theme === "light" ? "moon" : "sun"
        }  text-light-background  dark:text-dark-background  text-xl `}
      ></i>
    </button>
  );
}
function SettingsButton({ onToggleSettings }) {
  return (
    <button
      className="w-8 h-8 cursor-pointer rounded-lg bg-light-text dark:bg-dark-text grid place-content-center"
      onClick={onToggleSettings}
    >
      <i className="fa-solid fa-gear  text-light-background  dark:text-dark-background text-xl "></i>
    </button>
  );
}
// Hero Section
function HeroSection() {
  return (
    <div className="grid place-content-center place-items-center gap-24">
      <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
        Welcome to <span className="text-primary">QuizZ</span>, Your Gateway to
        Knowledge and Fun!
      </h1>
      <Button>Get Started</Button>
    </div>
  );
}

// Quiz Section
function Quiz() {
  const [questions, setQuestions] = useState(questionsSample);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [answers, setAnswers] = useState(answersSample);

  function handleAnswer(answer) {
    setTimeout(() => {
      // setCurrentQuestion((cq) => cq < questions.length - 1 && cq + 1);
      if (currentQuestion === questions.length - 1) {
        setQuizCompleted(true);
      }
    }, 3000);
  }
  function handleRetry() {
    setQuizCompleted(false);
    setCurrentQuestion(0);
  }

  return (
    <div className="flex flex-col items-center justify-evenly place-content-center mx-auto w-3/4">
      {quizCompleted ? (
        <QuizCompleted>
          <Button onclick={handleRetry}>
            <i className="fa-solid fa-redo-alt text-xl mr-2"></i> Try Again
          </Button>
        </QuizCompleted>
      ) : (
        <>
          <ProgressBar />
          <Question question={he.decode(questions[currentQuestion])} />
          <AnswersList>
            {answers[currentQuestion].map((answer) => (
              <Answer
                key={answer}
                correctAnswer={answers[currentQuestion][3]}
                onAnswer={handleAnswer}
              >
                {answer}
              </Answer>
            ))}
          </AnswersList>
        </>
      )}
    </div>
  );
}

function Question({ question }) {
  return (
    <h1 className="text-4xl font-bold text-center leading-normal dark:text-dark-text text-light-text">
      {question}
    </h1>
  );
}
function AnswersList({ children }) {
  return (
    <div className="flex w-full items-center flex-col gap-5">{children}</div>
  );
}
function Answer({
  children = "something went wrong",
  onAnswer,
  correctAnswer,
}) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  return (
    <button
      // : currentAnswer && !isIncorrect
      // ? "bg-light-incorrect dark:bg-dark-incorrect text-white"
      className={
        "px-5 py-3 w-3/4 font-bold text-lg text-start cursor-pointer rounded-xl flex justify-between items-center  " +
        (isAnswered
          ? "bg-light-correct dark:bg-dark-correct text-white"
          : "bg-light-secondary dark:bg-dark-secondary text-light-text-2 dark:text-dark-text-2 ")
      }
      onClick={() => {
        setIsAnswered(true);
        setIsCorrect(children === correctAnswer);
        onAnswer(children);
      }}
    >
      {children}
      {isAnswered && (
        <i className="fa-regular fa-circle-check text-2xl text-white"></i>
      )}
      {/* {currentAnswer && !isIncorrect && (
        <i className="fa-regular fa-circle-xmark text-2xl text-white"></i>
      )} */}
    </button>
  );
}
function ProgressBar() {
  return (
    <div
      className="flex w-full gap-3 items-center
    "
    >
      <div className="w-full h-[5px] rounded-lg bg-light-secondary dark:bg-dark-secondary  relative before:absolute before:inset-0  before:rounded-lg before:w-1/2 before:bg-primary"></div>
      <Progress />
    </div>
  );
}
function Progress() {
  return (
    <span className="font-bold text-lg dark:text-dark-text text-light-text">
      1/20
    </span>
  );
}
// Quiz completed section
function QuizCompleted({ children }) {
  return (
    <>
      <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
        Congratulations!
      </h1>
      <Stats />
      {children}
    </>
  );
}
function Stats() {
  return (
    <div className="flex flex-col gap-5 bg-light-secondary dark:bg-dark-secondary p-8 rounded-2xl w-4/5">
      <div className="flex justify-between mb-6">
        <h3 className="text-3xl font-bold text-light-text dark:text-dark-text">
          Your Score
        </h3>
        <span className="text-3xl font-bold text-light-text dark:text-dark-text">
          15/20
        </span>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Total Questions
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          20
        </span>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Correct
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          14
        </span>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Incorrect
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          6
        </span>
      </div>
    </div>
  );
}

// Settings Section
function Settings({ active }) {
  const [categorie, setCategorie] = useState("any");
  const [difficulty, setDifficulty] = useState("any");
  const [questionsNumber, setQuestionsNumber] = useState(20);
  const [type, setType] = useState("any");

  return (
    <div
      className={
        "absolute flex justify-center items-center w-full h-full bg-light-background dark:bg-dark-background  " +
        (active ? "z-10 opacity-100" : "-z-10 opacity-0")
      }
    >
      <div className="flex flex-col w-3/4">
        <h1 className="text-5xl mb-14 text-start font-bold text-light-text leading-normal dark:text-dark-text">
          Settings
        </h1>
        <form className="grid grid-cols-[1fr_300px] gap-6 w-full">
          <label className="text-xl font-bold text-light-text dark:text-dark-text">
            Category
          </label>
          <select
            className="cursor-pointer text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            <option value="any">Any Category</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label className="text-xl font-bold text-light-text dark:text-dark-text">
            Difficulty
          </label>
          <select
            className="cursor-pointer text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none "
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="any">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label className="text-xl font-bold text-light-text dark:text-dark-text">
            Questions Number
          </label>
          <select
            className="cursor-pointer text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none "
            value={questionsNumber}
            onChange={(e) => setQuestionsNumber(e.target.value)}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>

          <label className="text-xl font-bold text-light-text dark:text-dark-text">
            Type
          </label>
          <select
            className="cursor-pointer text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none "
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="any">Any Type</option>
            <option value="multiple">Multiple Choices</option>
            <option value="boolean">True / False</option>
          </select>
        </form>
      </div>
    </div>
  );
}

const a = async () => {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=&type=multiple"
  );
  const data = await response.json();
  console.log(data);
  console.log(data.results.map((question) => question.question));
  console.log(
    data.results.map((question) => [
      ...question.incorrect_answers,
      question.correct_answer,
    ])
  );
};
