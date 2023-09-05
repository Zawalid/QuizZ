import { useLocalStorageState } from "./useLocalStorageState";
import { defaultSettings } from "./Settings";

export function useSettings(isSettingsSaved) {
  const [category, setCategory] = useLocalStorageState(
    "category",
    defaultSettings.category,
    isSettingsSaved,
  );
  const [difficulty, setDifficulty] = useLocalStorageState(
    "difficulty",
    defaultSettings.difficulty,
    isSettingsSaved,
  );
  const [questionsNumber, setQuestionsNumber] = useLocalStorageState(
    "questionsNumber",
    defaultSettings.questionsNumber,
    isSettingsSaved,
  );
  const [type, setType] = useLocalStorageState(
    "type",
    defaultSettings.type,
    isSettingsSaved,
  );
  const [easyTime, setEasyTime] = useLocalStorageState(
    "easyTime",
    defaultSettings.easyTime,
    isSettingsSaved,
  );
  const [mediumTime, setMediumTime] = useLocalStorageState(
    "mediumTime",
    defaultSettings.mediumTime,
    isSettingsSaved,
  );
  const [hardTime, setHardTime] = useLocalStorageState(
    "hardTime",
    defaultSettings.hardTime,
    isSettingsSaved,
  );
  const [autoStartTimer, setAutoStartTimer] = useLocalStorageState(
    "autoStartTimer",
    defaultSettings.autoStartTimer,
    isSettingsSaved,
  );
  const [enableCorrectAnswerSound, setEnableCorrectAnswerSound] =
    useLocalStorageState(
      "enableCorrectAnswerSound",
      defaultSettings.enableCorrectAnswerSound,
      isSettingsSaved,
    );
  const [enableIncorrectAnswerSound, setEnableIncorrectAnswerSound] =
    useLocalStorageState(
      "enableIncorrectAnswerSound",
      defaultSettings.enableIncorrectAnswerSound,
      isSettingsSaved,
    );
  const [enableTimerSound, setEnableTimerSound] = useLocalStorageState(
    "enableTimerSound",
    defaultSettings.enableTimerSound,
    isSettingsSaved,
  );
  return {
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
  };
}
