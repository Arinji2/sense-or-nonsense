"use client";

import Image from "next/image";

export function InstructionButton({ isFake }: { isFake: boolean }) {
  return (
    <button className="relative flex size-[60px] flex-col items-center justify-center rounded-full bg-black">
      <Image
        src={isFake ? "/game/fake.png" : "/game/real.png"}
        alt="Real"
        width={30}
        height={30}
      />
      <div className="absolute bottom-0 right-0 size-4 animate-pulse rounded-full bg-purple-500"></div>
    </button>
  );
}
