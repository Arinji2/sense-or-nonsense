import Image from "next/image";
import { HeroHeader } from "./hero";

export default function Footer() {
  return (
    <div className="relative flex h-[100svh] w-full flex-col items-center justify-center gap-20">
      <div className="absolute left-0 top-0 h-[100svh] w-full">
        <Image
          src="/home/footer.png"
          quality={30}
          alt="Books"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="z-10 h-full w-full bg-[#1E1E1E]/70 backdrop-blur-sm"></div>
      </div>

      <div
        style={{
          minHeight: "inherit",
        }}
        className="z-10 flex h-full w-full flex-col items-center justify-center gap-20 px-4 py-10"
      >
        <HeroHeader />
      </div>
    </div>
  );
}
