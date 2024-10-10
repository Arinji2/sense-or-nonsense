import { useCallback, useRef } from "react";
import { toast } from "react-hot-toast";

export const useCpuTurn = ({
  isFakeWord,
  level,
  answerSubmitted,
}: {
  isFakeWord: boolean;
  level: number;
  answerSubmitted: (correct: boolean) => void;
}) => {
  const isProcessingRef = useRef(false);

  return useCallback(() => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    toast.success("CPU is thinking...");

    setTimeout(() => {
      const accuracyThreshold = level === 1 ? 0.5 : level === 2 ? 0.6 : 0.8;
      const isCorrect =
        Math.random() < accuracyThreshold ? !isFakeWord : Math.random() < 0.5;

      toast[isCorrect === isFakeWord ? "success" : "error"](
        `CPU was ${isCorrect === isFakeWord ? "Correct" : "Incorrect"}, The Word Is ${isFakeWord ? "Fake" : "Real"}!`,
      );

      answerSubmitted(isCorrect === isFakeWord);

      isProcessingRef.current = false;
    }, 2000);
  }, [isFakeWord, level, answerSubmitted]);
};

export default useCpuTurn;
