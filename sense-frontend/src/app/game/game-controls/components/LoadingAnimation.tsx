import { cn } from "../../../../../utils/cn";

export default function LoadingAnimation({
  isCorrect,
  streakCopy,
  isMultiPlayer,
  playerName,
}: {
  isCorrect: 0 | 1 | 2;
  streakCopy: number;
  isMultiPlayer: boolean;
  playerName: string;
}) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 flex h-[100svh] w-full -translate-y-full flex-col items-center justify-center gap-10 bg-neutral-700 transition-all duration-500 ease-in-out",
        {
          "translate-y-0": isCorrect !== 0,
          "bg-green-800": isCorrect === 2,
          "bg-red-800": isCorrect === 1,
        },
      )}
    >
      <h2
        className={cn(
          "text-lg font-bold text-white opacity-100 transition-all delay-700 duration-200 ease-pop-in md:text-xl xl:text-2xl",
          {
            "opacity-0": isCorrect === 0,
          },
        )}
      >
        {isCorrect === 2
          ? "Answer Correct!"
          : isCorrect === 1
            ? "Answer Incorrect!"
            : ""}
      </h2>

      <p
        className={cn(
          "text-xs font-bold text-white/70 opacity-100 transition-all delay-[750ms] duration-200 ease-pop-in md:text-lg xl:text-xl",
          {
            "opacity-0": isCorrect === 0,
          },
        )}
      >
        {streakCopy > 0
          ? isCorrect === 2
            ? `${isMultiPlayer ? `${playerName} is` : "You are"} on a ${streakCopy + 1} word streak!`
            : `${isMultiPlayer ? `${playerName} has lost their` : "You have lost your"} streak`
          : isCorrect === 2
            ? `${isMultiPlayer ? `${playerName} has` : "You have"} started a streak!`
            : ""}
      </p>
    </div>
  );
}
