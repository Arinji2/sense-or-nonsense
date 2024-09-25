import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ValidateGameIDCookie } from "../../utils/game-data";
import GameInProgress from "./game-in-progress";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let showGameModal = false;
  try {
    const game = await ValidateGameIDCookie();
    showGameModal = true;
  } catch (error) {}

  console.log(showGameModal);
  return (
    <html lang="en">
      <body className={pixelifySans.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              backgroundColor: "#2c2828",
              color: "white",
              borderRadius: "4px",
              fontWeight: 500,
              letterSpacing: "1px",
            },
          }}
        />
        <main className="flex h-fit w-full flex-col items-center justify-start bg-gradient-bg">
          {showGameModal && <GameInProgress />}
          {children}
        </main>
      </body>
    </html>
  );
}
