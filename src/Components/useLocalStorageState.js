import { useEffect, useState } from "react";

export function useLocalStorageState(key, initialState, isSettingsSaved) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      (key === "quizHistory" || isSettingsSaved) &&
        localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key, isSettingsSaved],
  );

  return [value, setValue];
}
