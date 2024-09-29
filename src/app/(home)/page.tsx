import Credits from "./credits";
import Hero from "./hero";
import Instructions from "./instructions";

export default function Page() {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-start overflow-x-hidden">
      <Hero />
      <Instructions />
      <Credits />
    </div>
  );
}
