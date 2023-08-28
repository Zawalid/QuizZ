import { useEffect, useState } from "react";
import he from "he";
import { nanoid } from "nanoid";

async function getQuizData({ category, difficulty, questionsNumber, type }) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${questionsNumber}&category=${
      category === "any" ? "" : category
    }&difficulty=${difficulty === "any" ? "" : difficulty}&type=${
      type === "any" ? "" : type
    }`
  );
  const data = await response.json();
  console.log(data);
  return data.results;
}
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
function Button({ children, onclick }) {
  return (
    <button
      className="px-5 py-3 w-44 mx-auto font-bold text-lg cursor-pointer rounded-2xl bg-primary outline-primary text-white "
      onClick={onclick}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState("any");
  const [questionsNumber, setQuestionsNumber] = useState(20);
  const [type, setType] = useState("any");
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    isSaved &&
      getQuizData({
        category,
        difficulty,
        questionsNumber,
        type,
      }).then((data) => {
        console.log(data);
        setIsSaved(false);
        if (data.length === 0) {
          setQuizData([]);
          return;
        }
        setQuizData(data);
      });
  }, [category, difficulty, questionsNumber, type, isSaved]);

  function handleSave() {
    setIsSaved(true);
    setQuizStarted(false);
    setSettingsOpen(false);
  }
  const questions = quizData.map((question) => he.decode(question.question));
  let answers = quizData.map((question) => {
    const randomIndex = Math.floor(
      Math.random() * (question.incorrect_answers.length + 1)
    );
    const answers =
      question.incorrect_answers.length === 1
        ? ["True", "False"]
        : [
            ...question.incorrect_answers.slice(0, randomIndex),
            question.correct_answer,
            ...question.incorrect_answers.slice(randomIndex),
          ];

    return answers.map((answer) => he.decode(answer));
  });
  answers = answers.map((answer) =>
    answer.map((answer) => {
      return {
        id: nanoid(),
        answer,
      };
    })
  );

  return (
    <div className="container mx-auto relative py-4 px-8 h-full grid grid-rows-[36px_1fr]">
      <Header>
        <SettingsButton onToggleSettings={() => setSettingsOpen((so) => !so)} />
      </Header>
      {quizStarted ? (
        <Quiz quizData={quizData} questions={questions} answers={answers} />
      ) : (
        <HeroSection>
          <Button onclick={() => setQuizStarted(true)}>
            <i className="fa-solid fa-play text-xl mr-4"></i>
            Start Quiz
          </Button>
        </HeroSection>
      )}
      <Settings
        active={settingsOpen}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        questionsNumber={questionsNumber}
        setQuestionsNumber={setQuestionsNumber}
        type={type}
        setType={setType}
      >
        <Button onclick={handleSave}>
          <i className="fa-regular fa-floppy-disk text-xl mr-4"></i>
          Save
        </Button>
      </Settings>
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
function HeroSection({ children }) {
  return (
    <div className="grid place-content-center place-items-center gap-24">
      <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
        Welcome to <span className="text-primary">QuizZ</span>, Your Gateway to
        Knowledge and Fun!
      </h1>
      {children}
    </div>
  );
}

// Quiz Section
function Quiz({ quizData, questions, answers }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctQuestions, setCorrectQuestions] = useState(0);

  const correctAnswer =
    !quizCompleted &&
    quizData.length > 0 &&
    he.decode(quizData[currentQuestion]?.correct_answer);

  function handleAnswer(answer) {
    answer === correctAnswer && setCorrectQuestions((ca) => ca + 1);
    setIsAnswered(true);
    setTimeout(() => {
      setIsAnswered(false);
      setCurrentQuestion((cq) => cq < questions.length - 1 && cq + 1);
      if (currentQuestion === questions.length - 1) {
        setQuizCompleted(true);
      }
    }, 2000);
  }
  function handleRetry() {
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setCorrectQuestions(0);
  }

  return (
    <div className="flex flex-col items-center justify-evenly place-content-center mx-auto w-3/4">
      {quizData.length === 0 ? (
        <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
          No Questions Found, Please Change Your Settings and Try Again
        </h1>
      ) : quizCompleted ? (
        <QuizCompleted
          totalQuestions={questions.length}
          correctQuestions={correctQuestions}
        >
          <Button onclick={handleRetry}>
            <i className="fa-solid fa-redo-alt text-xl mr-2"></i> Try Again
          </Button>
        </QuizCompleted>
      ) : (
        <>
          <ProgressBar
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
          />
          <Question question={questions[currentQuestion]} />
          <AnswersList>
            {answers[currentQuestion]?.map((answer) => (
              <Answer
                key={answer.id}
                correctAnswer={correctAnswer}
                onAnswer={handleAnswer}
                isAnswered={isAnswered}
              >
                {answer.answer}
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
  isAnswered,
}) {
  const correct = children === correctAnswer;
  const [isCurrentAnswer, setIsCurrentAnswer] = useState(false);
  return (
    <button
      className={
        "px-5 py-3 w-3/4 font-bold text-lg text-start cursor-pointer rounded-xl flex justify-between items-center  " +
        (isAnswered && correct
          ? "bg-light-correct dark:bg-dark-correct text-white"
          : isCurrentAnswer && !correct
          ? "bg-light-incorrect dark:bg-dark-incorrect text-white"
          : "bg-light-secondary dark:bg-dark-secondary text-light-text-2 dark:text-dark-text-2 ")
      }
      onClick={() => {
        if (!isAnswered) {
          onAnswer(children);
          setIsCurrentAnswer(true);
        }
      }}
    >
      {children}
      {isAnswered && correct && (
        <i className="fa-regular fa-circle-check text-2xl text-white"></i>
      )}
      {isCurrentAnswer && !correct && (
        <i className="fa-regular fa-circle-xmark text-2xl text-white"></i>
      )}
    </button>
  );
}
function ProgressBar({ totalQuestions, currentQuestion }) {
  const percentage = Math.round(((currentQuestion + 1) / totalQuestions) * 100);

  return (
    <div
      className="flex w-full gap-3 items-center
    "
    >
      <div className="w-full h-[5px] rounded-lg bg-light-secondary dark:bg-dark-secondary  relative">
        <div
          className="absolute inset-0  rounded-lg transition-[width] duration-1000 bg-primary"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <Progress
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
      />
    </div>
  );
}
function Progress({ totalQuestions, currentQuestion }) {
  return (
    <span className="font-bold text-lg dark:text-dark-text text-light-text">
      {currentQuestion + 1}/{totalQuestions}
    </span>
  );
}
// Quiz completed section
function QuizCompleted({ children, totalQuestions, correctQuestions }) {
  const percentage = Math.round((correctQuestions / totalQuestions) * 100);
  return (
    <>
      <Message percentage={percentage} />
      <Stats
        totalQuestions={totalQuestions}
        correctQuestions={correctQuestions}
        percentage={percentage}
      />
      {children}
    </>
  );
}
function Message({ percentage }) {
  const scoreMessages = [
    { maxScore: 20, message: "Stay curious, keep learning!" },
    { maxScore: 40, message: "Progress is progress! Keep it up." },
    { maxScore: 60, message: "You're on the right track, keep going!" },
    { maxScore: 80, message: "Impressive work, keep challenging yourself!" },
    { maxScore: 100, message: "Fantastic! You've mastered this quiz!" },
  ];
  return (
    <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
      {
        scoreMessages.find(
          (scoreMessage) => percentage <= scoreMessage.maxScore
        ).message
      }
    </h1>
  );
}
function Stats({ totalQuestions, correctQuestions, percentage }) {
  const incorrectQuestions = totalQuestions - correctQuestions;
  return (
    <div className="flex flex-col gap-5 bg-light-secondary dark:bg-dark-secondary p-8 rounded-2xl w-4/5">
      <div className="flex justify-between mb-6">
        <h3 className="text-3xl font-bold text-light-text dark:text-dark-text">
          Your Score
        </h3>
        <span className="text-3xl font-bold text-light-text dark:text-dark-text">
          {percentage}%
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
    </div>
  );
}

// Settings Section
function Settings({
  active,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  questionsNumber,
  setQuestionsNumber,
  type,
  setType,
  children,
}) {
  return (
    <div
      className={
        "absolute flex justify-center items-center w-full h-full bg-light-background dark:bg-dark-background  " +
        (active ? "z-10 opacity-100" : "-z-10 opacity-0")
      }
    >
      <div className="flex flex-col w-3/4">
        <h1 className="text-5xl text-start font-bold text-light-text leading-normal dark:text-dark-text">
          Settings
        </h1>
        <form className="grid my-14  grid-cols-[1fr_300px] gap-6 w-full">
          <label className="text-xl font-bold text-light-text dark:text-dark-text">
            Category
          </label>
          <select
            className="cursor-pointer text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none"
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
        {children}
      </div>
    </div>
  );
}
