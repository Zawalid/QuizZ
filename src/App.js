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
  const questionsTime = {
    easy: easyTime,
    medium: mediumTime,
    hard: hardTime,
  };

  return (
    <div className="container mx-auto relative py-4 px-8 h-full grid grid-rows-[36px_1fr]">
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
            <i className="fa-solid fa-play text-xl mr-4"></i>
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
          <i className="fa-regular fa-floppy-disk text-xl mr-4"></i>
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
    <header className="flex justify-between items-center relative z-20">
      <h2 className="text-3xl font-bold text-primary">QuizZ</h2>
      <div className="flex gap-5">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { theme })
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
      <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
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
    questionsTime[quizData[currentQuestion]?.difficulty] || 10
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
        questionsTime[quizData[currentQuestion]?.difficulty] || 10
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
    <div className="flex flex-col gap-5 items-center justify-evenly place-content-center mx-auto w-3/4">
      {loading ? (
        <div className="flex gap-5 items-baseline  place-content-center mx-auto w-3/4 ">
          <h1 className="text-5xl w-fit text-center font-bold text-light-text leading-normal  dark:text-dark-text">
            Loading Quiz
          </h1>
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-light-text dark:bg-dark-text animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-light-text dark:bg-dark-text animate-bounce-200 "></div>
            <div className="w-4 h-4 rounded-full bg-light-text dark:bg-dark-text animate-bounce-400 "></div>
          </div>
        </div>
      ) : quizData.length === 0 ? (
        <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
          No Questions Found, Please Change Your Settings and Try Again
        </h1>
      ) : quizCompleted ? (
        <QuizCompleted
          totalQuestions={questions.length}
          correctQuestions={correctQuestions}
          unAnsweredQuestions={unAnsweredQuestions}
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
              <i className="fa-solid fa-stop text-xl mr-2"></i> End Quiz
            </Button>
            <Button onclick={handleSkip}>
              <i className="fa-solid fa-forward text-xl mr-2"></i> Skip
            </Button>
          </ActionButtons>
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
    <div className="flex w-full items-center">
      {children[0]}
      <div className="flex flex-1 items-center flex-col gap-5">
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
        "px-5 py-3 w-3/4 font-bold text-lg text-start cursor-pointer rounded-xl flex justify-between items-center  " +
        ((isAnswered || isHintUsed) && correct
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
function QuestionTimer({ questionTime, isTimerPaused, onPause }) {
  let minutes = Math.floor(questionTime / 60);
  let seconds = questionTime % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return (
    <div className="w-24  gap-3 flex items-center rounded-xl px-3 py-2 bg-light-secondary dark:bg-dark-secondary ">
      <i
        className={
          "fa-solid " +
          `fa-${isTimerPaused ? "play" : "pause"}` +
          " text-xl dark:text-dark-text text-light-text cursor-pointer"
        }
        onClick={onPause}
      ></i>
      <span className="font-bold text-lg dark:text-dark-text text-light-text">
        {minutes}:{seconds}
      </span>
    </div>
  );
}
function ActionButtons({ children }) {
  return <div className="flex gap-10">{children}</div>;
}
function Hint({ hintsNumber = "0", onclick }) {
  const style = {
    "--content": `"${hintsNumber}"`,
  };
  return (
    <div className="hint" style={style}>
      <button
        className=" w-10 h-10 grid place-content-center rounded-full bg-light-secondary dark:bg-dark-secondary relative before:absolute before:-top-3 before:-right-1 before:w-5 before:h-5 before:rounded-full before:bg-primary before:text-sm before:font-bold before:text-white before:cursor-auto before:leading-tight"
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
    <h1 className="text-5xl text-center font-bold text-light-text leading-normal w-11/12 dark:text-dark-text">
      {
        scoreMessages.find(
          (scoreMessage) => percentage <= scoreMessage.maxScore
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
        "absolute flex justify-center items-center w-full h-full bg-light-background dark:bg-dark-background  " +
        (active ? "z-10 opacity-100" : "-z-10 opacity-0")
      }
    >
      <div className="flex flex-col w-3/4">
        <h1 className="text-5xl text-start font-bold text-light-text leading-normal dark:text-dark-text">
          Settings
        </h1>
        <div className="h-[400px] py-5 pe-5 overflow-y-auto">
          <h2 className="text-2xl mb-8 font-bold text-light-text-2 dark:text-dark-text-2">
            Quiz Options
          </h2>
          <form className="grid grid-cols-[1fr_300px] gap-6 w-full ps-5">
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
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
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
          <h2 className="text-2xl my-8 font-bold text-light-text-2 dark:text-dark-text-2">
            Timer Options
          </h2>
          <form className=" ps-5 gap-6 w-full">
            <label className="text-xl font-bold text-light-text dark:text-dark-text">
              Timer Duration{" "}
              <span className="text-sm text-light-text-2 dark:text-dark-text-2">
                (in secondes)
              </span>
            </label>
            <div className="ps-3 my-6 grid grid-cols-3 gap-5">
              <label className="text-lg font-bold text-light-text dark:text-dark-text">
                Easy Questions
              </label>
              <label className="text-lg font-bold text-light-text dark:text-dark-text">
                Medium Questions
              </label>
              <label className="text-lg font-bold text-light-text dark:text-dark-text">
                Hard Questions
              </label>

              <input
                type="number"
                min={5}
                max={60}
                value={easyTime}
                onChange={(e) => setEasyTime(e.target.value)}
                className="text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none "
              />
              <input
                type="number"
                min={10}
                max={90}
                value={mediumTime}
                onChange={(e) => setMediumTime(e.target.value)}
                className="text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none "
              />
              <input
                type="number"
                min={20}
                max={120}
                value={hardTime}
                onChange={(e) => setHardTime(e.target.value)}
                className="text-center text-xl font-bold text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary rounded-lg py-2 px-5 focus:outline-none "
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xl font-bold text-light-text dark:text-dark-text">
                Auto Start Timer
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox appearance-none peer absolute"
                  checked={autoStartTimer}
                  onChange={(e) => setAutoStartTimer(e.target.checked)}
                />
                <div
                  className="toggle-switch w-16 h-9 bg-light-secondary
              dark:bg-dark-secondary rounded-[20px] relative cursor-pointer transition-colors duration-300
              before:absolute before:w-7 before:h-7 before:rounded-full before:bg-light-text dark:before:bg-dark-text before:transition-[left] before:duration-300
              before:top-1 before:left-[5px] 
              peer-checked:bg-primary peer-checked:before:bg-white peer-checked:before:left-8
              "
                ></div>
              </label>
            </div>
          </form>
          <h2 className="text-2xl my-8 font-bold text-light-text-2 dark:text-dark-text-2">
            Sound Options
          </h2>
          <form className=" ps-5 gap-6 w-full">
            <div className="flex items-center justify-between">
              <label className="text-xl font-bold text-light-text dark:text-dark-text">
                Correct Answer Sound
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox appearance-none peer absolute"
                  checked={enableCorrectAnswerSound}
                  onChange={(e) =>
                    setEnableCorrectAnswerSound(e.target.checked)
                  }
                />
                <div
                  className="toggle-switch w-16 h-9 bg-light-secondary
              dark:bg-dark-secondary rounded-[20px] relative cursor-pointer transition-colors duration-300
              before:absolute before:w-7 before:h-7 before:rounded-full before:bg-light-text dark:before:bg-dark-text before:transition-[left] before:duration-300
              before:top-1 before:left-[5px] 
              peer-checked:bg-primary peer-checked:before:bg-white peer-checked:before:left-8
              "
                ></div>
              </label>
            </div>
            <div className="flex my-6 items-center justify-between">
              <label className="text-xl font-bold text-light-text dark:text-dark-text">
                Incorrect Answer Sound
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox appearance-none peer absolute"
                  checked={enableIncorrectAnswerSound}
                  onChange={(e) =>
                    setEnableIncorrectAnswerSound(e.target.checked)
                  }
                />
                <div
                  className="toggle-switch w-16 h-9 bg-light-secondary
              dark:bg-dark-secondary rounded-[20px] relative cursor-pointer transition-colors duration-300
              before:absolute before:w-7 before:h-7 before:rounded-full before:bg-light-text dark:before:bg-dark-text before:transition-[left] before:duration-300
              before:top-1 before:left-[5px] 
              peer-checked:bg-primary peer-checked:before:bg-white peer-checked:before:left-8
              "
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xl font-bold text-light-text dark:text-dark-text">
                Timer Sound
              </label>
              <label>
                <input
                  type="checkbox"
                  className="toggle-checkbox appearance-none peer absolute"
                  checked={enableTimerSound}
                  onChange={(e) => setEnableTimerSound(e.target.checked)}
                />
                <div
                  className="toggle-switch w-16 h-9 bg-light-secondary
              dark:bg-dark-secondary rounded-[20px] relative cursor-pointer transition-colors duration-300
              before:absolute before:w-7 before:h-7 before:rounded-full before:bg-light-text dark:before:bg-dark-text before:transition-[left] before:duration-300
              before:top-1 before:left-[5px] 
              peer-checked:bg-primary peer-checked:before:bg-white peer-checked:before:left-8
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
