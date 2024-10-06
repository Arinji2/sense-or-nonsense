import { Button } from "@/components/button";
import Link from "next/link";

export default function CTAHeader() {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-start gap-8 md:flex-row">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 md:flex-row xl:w-fit">
        <Link href="/single" className="h-fit w-full xl:w-fit">
          <Button className="w-full whitespace-nowrap bg-purple-500/60 text-[8px] text-white xl:w-fit xl:text-xs">
            Single Player
          </Button>
        </Link>
        <Link href="/multi" className="h-fit w-full xl:w-fit">
          <Button className="w-full whitespace-nowrap bg-pink-500/60 text-[8px] text-white xl:w-fit xl:text-xs">
            Multi Player
          </Button>
        </Link>
      </div>
      <Link href="/" className="h-fit w-full">
        <Button className="w-full whitespace-nowrap bg-blue-500/60 text-[8px] text-white xl:w-fit xl:text-xs">
          Home
        </Button>
      </Link>
    </div>
  );
}
