import Credits from "./credits";
import Footer from "./footer";
import Hero from "./hero";
import Instructions from "./instructions";

export default async function Page() {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-start overflow-x-hidden">
      <Hero />
      <Instructions />
      <Credits />
      <Footer />
    </div>
  );
}
