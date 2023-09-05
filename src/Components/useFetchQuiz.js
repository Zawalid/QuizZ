import { useEffect, useState } from "react";

export function useFetchQuiz(
  category,
  difficulty,
  questionsNumber,
  type,
  quizStarted,
  retryClickCount,
) {
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function getQuizData() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${questionsNumber}&category=${
            category === "any" ? "" : category
          }&difficulty=${difficulty === "any" ? "" : difficulty}&type=${
            type === "any" ? "" : type
          }`,
        );
        const json = await response.json();
        const data = json.results;
        if (data.length === 0)
          throw new Error(
            " No Questions Found, Please Change Your Settings and Try Again",
          );

        setQuizData(data);
      } catch (error) {
        console.error(error);
        error.message === "Failed to fetch"
          ? setError(
              "No Internet Connection, Please Check Your Connection and Try Again",
            )
          : setError(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }
    (quizStarted  || retryClickCount > 0) && getQuizData();
  }, [
    category,
    difficulty,
    questionsNumber,
    type,
    quizStarted,
    retryClickCount,
  ]);
  return { quizData, isLoading, error };
}
