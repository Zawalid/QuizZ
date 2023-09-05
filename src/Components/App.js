import React, { useRef, useState } from "react";
import he from "he";
import { nanoid } from "nanoid";

import timer from "../Assets/sounds/timer-sound.mp3";
import { Settings } from "./Settings";
import { Quiz } from "./Quiz";
import { Header, SettingsButton } from "./Header";
import { HeroSection } from "./HeroSection";
import { useSettings } from "./useSettings";
import { useFetchQuiz } from "./useFetchQuiz";

export const timerSoundEffect = new Audio(timer);
timerSoundEffect.setAttribute("loop", "true");

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const {
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
  } = useSettings(isSettingsSaved);
  const isChanged = useRef({
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
  const { quizData, isLoading, error } = useFetchQuiz(
    category,
    difficulty,
    questionsNumber,
    type,
    isSettingsSaved,
    quizStarted,
    retryClickCount,
  );

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

  function handleSave() {
    setIsSettingsOpen(false);
    if (
      [
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
      ].every((setting) => setting === isChanged.current[setting])
    ) {
      setIsSettingsSaved(false);
      return;
    } else {
      setIsSettingsSaved(true);
      setQuizStarted(false);
      isChanged.current = {
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
      };
      timerSoundEffect.pause();
    }
  }
  function handleSettingsToggle() {
    if (isSettingsOpen) {
      setCategory(isChanged.current.category);
      setDifficulty(isChanged.current.difficulty);
      setQuestionsNumber(isChanged.current.questionsNumber);
      setType(isChanged.current.type);
      setEasyTime(isChanged.current.easyTime);
      setMediumTime(isChanged.current.mediumTime);
      setHardTime(isChanged.current.hardTime);
      setAutoStartTimer(isChanged.current.autoStartTimer);
      setEnableCorrectAnswerSound(isChanged.current.enableCorrectAnswerSound);
      setEnableIncorrectAnswerSound(
        isChanged.current.enableIncorrectAnswerSound,
      );
      setEnableTimerSound(isChanged.current);
    }
    setIsSettingsOpen((so) => !so);
  }

  return (
    <div className="container relative mx-auto grid h-auto min-h-full grid-rows-[36px_1fr] gap-10 px-8  py-6 max-md:px-4">
      <Header>
        <SettingsButton
          onToggleSettings={handleSettingsToggle}
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
          enableTimerSound={isChanged.current.enableTimerSound}
          isSettingsSaved={isSettingsSaved}
          isLoading={isLoading}
          error={error}
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

export function Button({ children, onclick }) {
  return (
    <button
      className="mx-auto w-48 cursor-pointer rounded-2xl bg-primary px-5 py-3 text-lg font-bold text-white outline-primary
      max-md:w-full
      "
      onClick={onclick}
    >
      {children}
    </button>
  );
}
export function ActionButtons({ children }) {
  return (
    <div className="flex gap-10 max-md:w-full max-md:gap-5 max-[420px]:flex-wrap">
      {children}
    </div>
  );
}
