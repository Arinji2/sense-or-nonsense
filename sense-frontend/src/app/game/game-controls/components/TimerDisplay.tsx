import { Bot, Loader2 } from "lucide-react";
import { useTimerContext } from "../../context/timer-context";

export default function TImerDisplay({
  aiThinking,
  loading,
}: {
  aiThinking: boolean;
  loading: boolean;
}) {
  const { timer } = useTimerContext();

  return (
    <div className="flex size-16 flex-col items-center justify-center rounded-full bg-[#FCAB3A] p-3 tracking-number shadow-xl shadow-white/10 md:size-20">
      {aiThinking ? (
        <Bot className="size-[15px] animate-pulse text-black md:size-[25px]" />
      ) : loading ? (
        <Loader2 className="size-[15px] animate-spin text-black md:size-[25px]" />
      ) : (
        <p className="text-center text-[15px] font-bold text-black md:text-[25px]">
          {timer}
        </p>
      )}
    </div>
  );
}
