import { memo, useEffect, useRef, useState } from "react";
import he from "he";
import { QuizCompleted } from "../Quiz Summary/QuizCompleted";
import { QuizHistory } from "../Quiz History/QuizHistory";
import { Hint } from "./Hint";
import { AnswersList, Answer } from "./AnswersList";
import { ProgressBar } from "./ProgressBar";
import { QuestionTimer } from "./QuestionTimer";
import { timerSoundEffect, Button, ActionButtons } from "../App";
import correctAnswer from "../../Assets/sounds/correct-answer-sound.mp3";
import incorrectAnswer from "../../Assets/sounds/wrong-answer-sound.mp3";
import { useLocalStorageState } from "../useLocalStorageState";

const correctAnswerSoundEffect = new Audio(correctAnswer);
const incorrectAnswerSoundEffect = new Audio(incorrectAnswer);
function Quiz({
  quizStarted,
  setQuizStarted,
  quizData,
  isLoading,
  error,
  questions,
  answers,
  onRetry,
  questionsNumber,
  questionsTime,
  autoStartTimer,
  enableCorrectAnswerSound,
  enableIncorrectAnswerSound,
  enableTimerSound,
  onBackToHome,
  isQuizHistoryOpen,
  setIsQuizHistoryOpen,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [unAnsweredQuestions, setUnAnsweredQuestions] = useState(0);
  const [hintsNumber, setHintsNumber] = useState(questionsNumber / 5);
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [questionTime, setQuestionTime] = useState(
    questionsTime[quizData[currentQuestion]?.difficulty] || 10,
  );
  const [isTimerPaused, setIsTimerPaused] = useState(!autoStartTimer);
  const quizTime = useRef(0);
  const [quizHistory, setQuizHistory] = useLocalStorageState("quizHistory", []);
  const quizNumber = useRef(quizHistory.length + 1);
  const [isAddedToHistory, setIsAddedToHistory] = useState(false);

  const totalQuestions = questions.length;
  const incorrectQuestions =
    totalQuestions - correctQuestions - unAnsweredQuestions;
  const score = Math.round((correctQuestions / totalQuestions) * 100);

  const correctAnswer =
    !quizCompleted &&
    quizData.length > 0 &&
    he.decode(quizData[currentQuestion]?.correct_answer);

  useEffect(() => {
    if (questionTime === 0) handleSkip();
    if (
      isAnswered ||
      quizCompleted ||
      isLoading ||
      isTimerPaused ||
      isQuizHistoryOpen
    )
      return;
    const intervalId = setInterval(() => {
      setQuestionTime((qt) => qt - 1);
    }, 1000);
    enableTimerSound && timerSoundEffect.play();

    return () => {
      clearInterval(intervalId);
      timerSoundEffect.pause();
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    questionTime,
    isAnswered,
    quizCompleted,
    isLoading,
    isTimerPaused,
    enableTimerSound,
    isQuizHistoryOpen,
  ]);
  useEffect(() => {
    if (quizCompleted) return;
    const intervalId = setInterval(() => {
      quizTime.current += 1;
    }, 1000);
    return () => clearInterval(intervalId);
  }, [quizCompleted]);
  useEffect(() => {
    if (quizCompleted && !isAddedToHistory) {
      handleAddToQuizHistory({
        totalQuestions,
        correctQuestions,
        incorrectQuestions,
        unAnsweredQuestions,
        score,
        quizTime: quizTime.current,
      });
      setIsAddedToHistory(true);
    }
    // eslint-disable-next-line
  }, [quizCompleted, isAddedToHistory]);

  function handleAnswer(answer) {
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
      if (currentQuestion === totalQuestions - 1) {
        timerSoundEffect.pause();
        setQuizCompleted(true);
      }
    }, 2000);
  }
  function handleRetry() {
    onRetry();
    setQuizStarted(true);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setCorrectQuestions(0);
    setUnAnsweredQuestions(0);
    setHintsNumber(questionsNumber / 5);
    setIsHintUsed(false);
    setIsTimerPaused(!autoStartTimer);
    quizTime.current = 0;
    setIsAddedToHistory(false);
  }
  function handleSkip() {
    setUnAnsweredQuestions((uaq) => uaq + 1);
    setCurrentQuestion((cq) => cq + 1);
    currentQuestion === totalQuestions - 1 && setQuizCompleted(true);
    setIsHintUsed(false);
    setQuestionTime(questionsTime[quizData[currentQuestion]?.difficulty] || 10);
    setIsTimerPaused(!autoStartTimer);
  }
  function handleEndQuiz() {
    setQuizCompleted(true);
    setUnAnsweredQuestions((uaq) => uaq + totalQuestions - currentQuestion);
    setQuestionTime(questionsTime[quizData[currentQuestion]?.difficulty] || 10);
  }
  function handlePause() {
    setIsTimerPaused((itp) => !itp);
  }
  function handleAddToQuizHistory({
    totalQuestions,
    correctQuestions,
    incorrectQuestions,
    unAnsweredQuestions,
    score,
    quizTime,
  }) {
    setQuizHistory((qh) => [
      ...qh,
      {
        totalQuestions,
        correctQuestions,
        incorrectQuestions,
        unAnsweredQuestions,
        score,
        quizTime,
        quizNumber: quizNumber.current++,
      },
    ]);
  }
  function handleClearQuizHistory() {
    setQuizHistory([]);
    quizNumber.current = 1;
  }
  function handleRemoveFromQuizHistory(quizNumber) {
    setQuizHistory((qh) => qh.filter((quiz) => quiz.quizNumber !== quizNumber));
  }
  return (
    <div
      className={`mx-auto flex  flex-col place-content-center items-center justify-evenly gap-7  max-md:w-full  lg:w-3/4 ${
        isQuizHistoryOpen ? " overflow-hidden" : ""
      }`}
    >
      {isLoading && !isQuizHistoryOpen && !quizCompleted && <Loading />}
      {error && <Error>{error}</Error>}
      {!error && !isLoading && !isQuizHistoryOpen && quizCompleted && (
        <QuizCompleted
          totalQuestions={questions.length}
          correctQuestions={correctQuestions}
          unAnsweredQuestions={unAnsweredQuestions}
          quizTime={quizTime.current}
          onCompleted={handleAddToQuizHistory}
        >
          <ActionButtons>
            <Button onclick={() => setIsQuizHistoryOpen(true)}>
              <i className="fa-solid fa-clock-rotate-left mr-2 text-xl"></i>{" "}
              Quiz History
            </Button>
            <Button onclick={handleRetry}>
              <i className="fa-solid fa-redo-alt mr-2 text-xl"></i> Try Again
            </Button>
          </ActionButtons>
        </QuizCompleted>
      )}
      {!error &&
        !isLoading &&
        !isQuizHistoryOpen &&
        !quizCompleted &&
        quizData.length > 0 && (
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
              <Button onclick={() => !isAnswered && handleEndQuiz()}>
                <i className="fa-solid fa-stop mr-2 text-xl"></i> End Quiz
              </Button>
              <Button onclick={() => !isAnswered && handleSkip()}>
                <i className="fa-solid fa-forward mr-2 text-xl"></i> Skip
              </Button>
            </ActionButtons>
          </>
        )}
      {isQuizHistoryOpen && (
        <QuizHistory
          quizHistory={quizHistory}
          onRemoveFromQuizHistory={handleRemoveFromQuizHistory}
          onClearQuizHistory={handleClearQuizHistory}
        >
          <ActionButtons>
            <Button onclick={onBackToHome}>
              <i className="fa-solid fa-home mr-2 text-xl"></i> Home Page
            </Button>
            {quizStarted && (
              <Button
                onclick={() => {
                  handleRetry();
                  setIsQuizHistoryOpen(false);
                }}
              >
                <i className="fa-solid fa-redo-alt mr-2 text-xl"></i> Try Again
              </Button>
            )}
          </ActionButtons>
        </QuizHistory>
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
function Error({ children }) {
  return (
    <h1 className=" text-center text-5xl font-bold leading-normal text-light-text dark:text-dark-text  max-md:text-4xl">
      {children}
    </h1>
  );
}

export const MemoizedQuiz = memo(Quiz);
