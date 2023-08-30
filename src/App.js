import React, { useEffect, useState } from "react";
import he from "he";
import { nanoid } from "nanoid";
import { ReactComponent as SunIcon } from "./Assets/icons/sun.svg";
import { ReactComponent as MoonIcon } from "./Assets/icons/moon.svg";
import { ReactComponent as SettingsIcon } from "./Assets/icons/settings.svg";

import correctAnswer from "./Assets/sounds/correct-answer-sound.mp3";
import incorrectAnswer from "./Assets/sounds/wrong-answer-sound.mp3";
import timer from "./Assets/sounds/timer-sound.mp3";

const correctAnswerSoundEffect = new Audio(correctAnswer);
const incorrectAnswerSoundEffect = new Audio(incorrectAnswer);
const timerSoundEffect = new Audio(timer);
timerSoundEffect.setAttribute("loop", "true");

async function getQuizData({ category, difficulty, questionsNumber, type }) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${questionsNumber}&category=${
      category === "any" ? "" : category
    }&difficulty=${difficulty === "any" ? "" : difficulty}&type=${
      type === "any" ? "" : type
    }`,
  );
  const data = await response.json();
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
      className="mx-auto w-44 cursor-pointer rounded-2xl bg-primary px-5 py-3 text-lg font-bold text-white outline-primary
      max-md:w-full
      "
      onClick={onclick}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState("any");
  const [questionsNumber, setQuestionsNumber] = useState(5);
  const [type, setType] = useState("any");
  const [easyTime, setEasyTime] = useState(15);
  const [mediumTime, setMediumTime] = useState(20);
  const [hardTime, setHardTime] = useState(30);
  const [autoStartTimer, setAutoStartTimer] = useState(true);
  const [enableCorrectAnswerSound, setEnableCorrectAnswerSound] =
    useState(true);
  const [enableIncorrectAnswerSound, setEnableIncorrectAnswerSound] =
    useState(true);
  const [enableTimerSound, setEnableTimerSound] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isChanged, setIsChanged] = useState({
    category,
    difficulty,
    questionsNumber,
    type,
    easyTime,
    mediumTime,
    hardTime,
    autoStartTimer,
    enableCorrectAnswerSound,
    enableIncorrectAnswerSound,
    enableTimerSound,
  });
  const [retryClickCount, setRetryClickCount] = useState(0);

  useEffect(() => {
    (quizStarted || isSaved || retryClickCount > 0) &&
      getQuizData({
        category,
        difficulty,
        questionsNumber,
        type,
      }).then((data) => {
        if (data.length === 0) {
          setQuizData([]);
          return;
        }
        setQuizData(data);
      });
  }, [
    category,
    difficulty,
    questionsNumber,
    type,
    isSaved,
    quizStarted,
    retryClickCount,
  ]);

  function handleSave() {
    setIsSettingsOpen(false);
    if (
      category === isChanged.category &&
      difficulty === isChanged.difficulty &&
      questionsNumber === isChanged.questionsNumber &&
      type === isChanged.type &&
      easyTime === isChanged.easyTime &&
      mediumTime === isChanged.mediumTime &&
      hardTime === isChanged.hardTime &&
      autoStartTimer === isChanged.autoStartTimer &&
      enableCorrectAnswerSound === isChanged.enableCorrectAnswerSound &&
      enableIncorrectAnswerSound === isChanged.enableIncorrectAnswerSound &&
      enableTimerSound === isChanged.enableTimerSound
    ) {
      setIsSaved(false);
      return;
    } else {
      setIsSaved(true);
      setQuizStarted(false);
      setIsChanged({
        category,
        difficulty,
        questionsNumber,
        type,
        easyTime,
        mediumTime,
        hardTime,
        autoStartTimer,
        enableCorrectAnswerSound,
        enableIncorrectAnswerSound,
        enableTimerSound,
      });
      timerSoundEffect.pause();
    }
  }
  const questions = quizData.map((question) => he.decode(question.question));
  let answers = quizData.map((question) => {
    const randomIndex = Math.floor(
      Math.random() * (question.incorrect_answers.length + 1),
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
    }),
  );
  const questionsTime = {
    easy: easyTime,
    medium: mediumTime,
    hard: hardTime,
  };

  return (
    <div className="container relative mx-auto grid h-auto min-h-full grid-rows-[36px_1fr] gap-10 px-8  py-6 max-md:px-4">
      <Header>
        <SettingsButton
          onToggleSettings={() => setIsSettingsOpen((so) => !so)}
          isSettingsOpen={isSettingsOpen}
        />
      </Header>
      {quizStarted ? (
        <Quiz
          quizData={quizData}
          questions={questions}
          answers={answers}
          onRetry={() => setRetryClickCount((rcc) => rcc + 1)}
          questionsNumber={questionsNumber}
          questionsTime={questionsTime}
          autoStartTimer={autoStartTimer}
          enableCorrectAnswerSound={enableCorrectAnswerSound}
          enableIncorrectAnswerSound={enableIncorrectAnswerSound}
          enableTimerSound={enableTimerSound}
          isSaved={isSaved}
        />
      ) : (
        <HeroSection>
          <Button onclick={() => setQuizStarted(true)}>
            <i className="fa-solid fa-play mr-4 text-xl"></i>
            Start Quiz
          </Button>
        </HeroSection>
      )}
      <Settings
        active={isSettingsOpen}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        questionsNumber={questionsNumber}
        setQuestionsNumber={setQuestionsNumber}
        type={type}
        setType={setType}
        easyTime={easyTime}
        setEasyTime={setEasyTime}
        mediumTime={mediumTime}
        setMediumTime={setMediumTime}
        hardTime={hardTime}
        setHardTime={setHardTime}
        autoStartTimer={autoStartTimer}
        setAutoStartTimer={setAutoStartTimer}
        enableCorrectAnswerSound={enableCorrectAnswerSound}
        setEnableCorrectAnswerSound={setEnableCorrectAnswerSound}
        enableIncorrectAnswerSound={enableIncorrectAnswerSound}
        setEnableIncorrectAnswerSound={setEnableIncorrectAnswerSound}
        enableTimerSound={enableTimerSound}
        setEnableTimerSound={setEnableTimerSound}
      >
        <Button onclick={handleSave}>
          <i className="fa-regular fa-floppy-disk mr-4 text-xl"></i>
          Save
        </Button>
      </Settings>
    </div>
  );
}
// Header
function Header({ children }) {
  const [theme, setTheme] = useState(localStorage.theme || "light");
  function toggleTheme() {
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    setTheme((th) => (th === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark");
  }
  return (
    <header className="relative z-20 flex items-center justify-between">
      {/* <h2 className="text-3xl font-bold text-primary">QuizZ</h2> */}
      <img src="/Logo-192.png" alt="QuizZ" className="h-20 w-20" />
      <div className="flex gap-5">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { theme }),
        )}
        <ThemeSwitcher theme={theme} onclick={toggleTheme} />
      </div>
    </header>
  );
}
function ThemeSwitcher({ theme, onclick }) {
  return (
    <button className=" cursor-pointer " onClick={onclick}>
      {theme === "light" ? <MoonIcon fill="#333" /> : <SunIcon fill="#fff" />}
    </button>
  );
}
function SettingsButton({ isSettingsOpen, onToggleSettings, theme }) {
  return (
    <button className=" cursor-pointer " onClick={onToggleSettings}>
      {theme === "light" ? (
        <SettingsIcon fill={isSettingsOpen ? "#9C27B0" : "#333"} />
      ) : (
        <SettingsIcon fill={isSettingsOpen ? "#9C27B0" : "#fff"} />
      )}
    </button>
  );
}
// Hero Section
function HeroSection({ children }) {
  return (
    <div className="grid place-content-center place-items-center gap-24">
      <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:text-4xl">
        Welcome to <span className="text-primary">QuizZ</span>, Your Gateway to
        Knowledge and Fun!
      </h1>
      {children}
    </div>
  );
}

// Quiz Section
function Quiz({
  quizData,
  questions,
  answers,
  onRetry,
  questionsNumber,
  questionsTime,
  autoStartTimer,
  enableCorrectAnswerSound,
  enableIncorrectAnswerSound,
  enableTimerSound,
  isSaved,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [unAnsweredQuestions, setUnAnsweredQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hintsNumber, setHintsNumber] = useState(questionsNumber / 5);
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [questionTime, setQuestionTime] = useState(
    questionsTime[quizData[currentQuestion]?.difficulty] || 10,
  );
  const [isTimerPaused, setIsTimerPaused] = useState(!autoStartTimer);

  useEffect(() => {
    if (
      questionTime === 0 ||
      isAnswered ||
      quizCompleted ||
      loading ||
      isTimerPaused
    )
      return;
    const intervalId = setInterval(() => {
      setQuestionTime((qt) => qt - 1);
    }, 1000);
    enableTimerSound && isSaved && timerSoundEffect.play();
    return () => clearInterval(intervalId);
  }, [questionTime, isAnswered, quizCompleted, loading, isTimerPaused]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  const correctAnswer =
    !quizCompleted &&
    quizData.length > 0 &&
    he.decode(quizData[currentQuestion]?.correct_answer);

  questionTime === 0 && handleSkip();
  function handleAnswer(answer) {
    timerSoundEffect.pause();
    if (answer === correctAnswer) {
      setCorrectQuestions((ca) => ca + 1);
      enableCorrectAnswerSound && correctAnswerSoundEffect.play();
    } else {
      enableIncorrectAnswerSound && incorrectAnswerSoundEffect.play();
    }
    setIsAnswered(true);
    setIsHintUsed(false);
    setTimeout(() => {
      enableTimerSound && timerSoundEffect.play();
      setIsTimerPaused(!autoStartTimer);
      setIsAnswered(false);
      setQuestionTime(
        questionsTime[quizData[currentQuestion]?.difficulty] || 10,
      );
      setCurrentQuestion((cq) => cq + 1);
      currentQuestion === questions.length - 1 && setQuizCompleted(true);
    }, 2000);
  }
  function handleRetry() {
    onRetry();
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setCorrectQuestions(0);
    setUnAnsweredQuestions(0);
    setLoading(true);
    setHintsNumber(questionsNumber / 5);
    setIsHintUsed(false);
    setIsTimerPaused(!autoStartTimer);
    timerSoundEffect.pause();
  }
  function handleSkip() {
    setUnAnsweredQuestions((uaq) => uaq + 1);
    setCurrentQuestion((cq) => cq + 1);
    currentQuestion === questions.length - 1 && setQuizCompleted(true);
    setIsHintUsed(false);
    setQuestionTime(questionsTime[quizData[currentQuestion]?.difficulty] || 10);
    setIsTimerPaused(!autoStartTimer);
  }
  function handleEndQuiz() {
    setQuizCompleted(true);
    setUnAnsweredQuestions((uaq) => uaq + questions.length - currentQuestion);
  }
  function handlePause() {
    setIsTimerPaused((itp) => !itp);
    timerSoundEffect.pause();
  }
  return (
    <div className="mx-auto flex w-3/4 flex-col place-content-center items-center justify-evenly gap-7 max-md:w-full">
      {loading ? (
        <Loading />
      ) : quizData.length === 0 ? (
        <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text">
          No Questions Found, Please Change Your Settings and Try Again
        </h1>
      ) : quizCompleted ? (
        <QuizCompleted
          totalQuestions={questions.length}
          correctQuestions={correctQuestions}
          unAnsweredQuestions={unAnsweredQuestions}
        >
          <Button onclick={handleRetry}>
            <i className="fa-solid fa-redo-alt mr-2 text-xl"></i> Try Again
          </Button>
        </QuizCompleted>
      ) : (
        <>
          <ProgressBar
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
          />
          <Question question={questions[currentQuestion]} />
          <AnswersList hintsNumber={hintsNumber}>
            <QuestionTimer
              questionTime={questionTime}
              isTimerPaused={isTimerPaused}
              onPause={handlePause}
            />
            {answers[currentQuestion]?.map((answer) => (
              <Answer
                key={answer.id}
                correctAnswer={correctAnswer}
                onAnswer={handleAnswer}
                isAnswered={isAnswered}
                isHintUsed={isHintUsed}
              >
                {answer.answer}
              </Answer>
            ))}
            <Hint
              hintsNumber={hintsNumber}
              onclick={() => {
                if (hintsNumber === 0 || isHintUsed) return;
                setHintsNumber((hn) => hn - 1);
                setIsHintUsed(true);
              }}
            />
          </AnswersList>
          <ActionButtons>
            <Button onclick={handleEndQuiz}>
              <i className="fa-solid fa-stop mr-2 text-xl"></i> End Quiz
            </Button>
            <Button onclick={handleSkip}>
              <i className="fa-solid fa-forward mr-2 text-xl"></i> Skip
            </Button>
          </ActionButtons>
        </>
      )}
    </div>
  );
}
function Question({ question }) {
  return (
    <h1 className="text-center text-4xl font-bold leading-normal text-light-text dark:text-dark-text max-md:text-3xl">
      {question}
    </h1>
  );
}
function AnswersList({ children }) {
  return (
    <div className="flex w-full items-center max-md:flex-col max-md:gap-5">
      {children[0]}
      <div className="flex flex-1 flex-col items-center gap-5 max-md:w-full">
        {children[1]}
      </div>
      {children[2]}
    </div>
  );
}
function Answer({
  children = "something went wrong",
  onAnswer,
  correctAnswer,
  isAnswered,
  isHintUsed,
}) {
  const correct = children === correctAnswer;
  const [isCurrentAnswer, setIsCurrentAnswer] = useState(false);
  return (
    <button
      className={
        "flex w-3/4 cursor-pointer items-center justify-between rounded-xl px-5 py-3 text-start text-lg font-bold max-md:w-full  " +
        ((isAnswered || isHintUsed) && correct
          ? "bg-light-correct text-white dark:bg-dark-correct"
          : isCurrentAnswer && !correct
          ? "bg-light-incorrect text-white dark:bg-dark-incorrect"
          : "bg-light-secondary text-light-text-2 dark:bg-dark-secondary dark:text-dark-text-2 ")
      }
      onClick={() => {
        if (!isAnswered) {
          onAnswer(children);
          setIsCurrentAnswer(true);
        }
      }}
    >
      {children}
      {isAnswered && correct ? (
        <i className="fa-regular fa-circle-check text-2xl text-white"></i>
      ) : (
        isHintUsed &&
        correct && (
          <i className="fa-regular fa-lightbulb text-2xl text-white"></i>
        )
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
      className="flex w-full items-center gap-3
    "
    >
      <div className="relative h-[5px] w-full rounded-lg bg-light-secondary  dark:bg-dark-secondary">
        <div
          className="absolute inset-0  rounded-lg bg-primary transition-[width] duration-1000"
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
    <span className="text-lg font-bold text-light-text dark:text-dark-text">
      {currentQuestion + 1}/{totalQuestions}
    </span>
  );
}
function QuestionTimer({ questionTime, isTimerPaused, onPause }) {
  let minutes = Math.floor(questionTime / 60);
  let seconds = questionTime % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return (
    <div className="flex  w-24 items-center gap-3 rounded-xl bg-light-secondary px-3 py-2 dark:bg-dark-secondary ">
      <i
        className={
          "fa-solid " +
          `fa-${isTimerPaused ? "play" : "pause"}` +
          " cursor-pointer text-xl text-light-text dark:text-dark-text"
        }
        onClick={onPause}
      ></i>
      <span className="text-lg font-bold text-light-text dark:text-dark-text">
        {minutes}:{seconds}
      </span>
    </div>
  );
}
function ActionButtons({ children }) {
  return (
    <div className="flex gap-10 max-md:w-full  max-md:gap-5">{children}</div>
  );
}
function Hint({ hintsNumber = "0", onclick }) {
  const style = {
    "--content": `"${hintsNumber}"`,
  };
  return (
    <div className="hint" style={style}>
      <button
        className=" relative grid h-10 w-10 place-content-center rounded-full bg-light-secondary before:absolute before:-right-1 before:-top-3 before:h-5 before:w-5 before:cursor-auto before:rounded-full before:bg-primary before:text-sm before:font-bold before:leading-tight before:text-white dark:bg-dark-secondary"
        onClick={onclick}
      >
        <i
          className="fa-regular fa-lightbulb text-xl text-[#D4AF37] dark:text-[#FFD700] 
      "
        ></i>
      </button>
    </div>
  );
}
function Loading() {
  return (
    <div className="mx-auto flex  w-3/4  place-content-center items-baseline gap-5 max-md:w-full ">
      <h1 className="w-fit text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text  max-md:text-4xl">
        Loading Quiz
      </h1>
      <div className="flex gap-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-light-text dark:bg-dark-text"></div>
        <div className="h-4 w-4 animate-bounce-200 rounded-full bg-light-text dark:bg-dark-text "></div>
        <div className="h-4 w-4 animate-bounce-400 rounded-full bg-light-text dark:bg-dark-text "></div>
      </div>
    </div>
  );
}
// Quiz completed section
function QuizCompleted({
  children,
  totalQuestions,
  correctQuestions,
  unAnsweredQuestions,
}) {
  const percentage = Math.round((correctQuestions / totalQuestions) * 100);
  return (
    <>
      <ScoreMessage percentage={percentage} />
      <Stats
        totalQuestions={totalQuestions}
        correctQuestions={correctQuestions}
        percentage={percentage}
        unAnsweredQuestions={unAnsweredQuestions}
      />
      {children}
    </>
  );
}
function ScoreMessage({ percentage }) {
  const scoreMessages = [
    { maxScore: 20, message: "Stay curious, keep learning!" },
    { maxScore: 40, message: "Progress is progress! Keep it up." },
    { maxScore: 60, message: "You're on the right track, keep going!" },
    { maxScore: 80, message: "Impressive work, keep challenging yourself!" },
    { maxScore: 100, message: "Fantastic! You've mastered this quiz!" },
  ];
  return (
    <h1 className="w-11/12 text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:w-full max-md:text-4xl">
      {
        scoreMessages.find(
          (scoreMessage) => percentage <= scoreMessage.maxScore,
        ).message
      }
    </h1>
  );
}
function Stats({
  totalQuestions,
  correctQuestions,
  percentage,
  unAnsweredQuestions,
}) {
  const incorrectQuestions =
    totalQuestions - correctQuestions - unAnsweredQuestions;
  return (
    <div className="flex w-4/5 flex-col gap-5 rounded-2xl bg-light-secondary p-8 dark:bg-dark-secondary max-md:w-full">
      <div className="mb-6 flex justify-between">
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
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          Unanswered
        </h3>
        <span className="text-xl font-bold text-light-text-2 dark:text-dark-text-2">
          {unAnsweredQuestions}
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
}) {
  return (
    <div
      className={
        "fixed left-0 flex h-full w-full items-center justify-center bg-light-background dark:bg-dark-background  " +
        (active ? "z-10 opacity-100" : "-z-10 opacity-0")
      }
    >
      <div className="flex w-3/4 flex-col  gap-5 max-md:w-full max-md:px-4">
        <h1 className="text-start text-5xl font-bold leading-normal text-light-text dark:text-dark-text max-md:text-4xl">
          Settings
        </h1>
        <div className="h-[400px] overflow-y-auto py-5 pe-5">
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
