import OGImage from "@/../public/og.png";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { ValidateGameIDCookie } from "../../utils/game-data";
import GameInProgress from "./game-in-progress";
import "./globals.css";

const dogicalPixelFont = localFont({
  src: [
    {
      path: "./../fonts/dogicapixel.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../fonts/dogicapixelbold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sense Or Nonsense",
  description: "Mandela Effect on basic English Words amplified",
  authors: {
    name: "Arinji",
    url: "https://arinji.com",
  },
  openGraph: {
    title: `Sense Or Nonsense`,
    description: "Mandela Effect on basic English Words amplified",
    images: [
      {
        url: OGImage.src,
        width: OGImage.width,
        height: OGImage.height,
        alt: "Sense Or Nonsense",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Sense Or Nonsense`,
    description: "Mandela Effect on basic English Words amplified",
    images: [
      {
        url: OGImage.src,
        width: OGImage.width,
        height: OGImage.height,
        alt: "Sense Or Nonsense",
      },
    ],
  },

  metadataBase: new URL("https://sense.arinji.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let showGameModal = false;
  try {
    const game = await ValidateGameIDCookie({
      disableRedirect: true,
    });
  } catch (error: any) {
    if (error.message === "Exiting for error") {
      showGameModal = false;
    } else {
      showGameModal = true;
    }
  }

  return (
    <html lang="en" className="bg-[#2C2828]">
      <body className={dogicalPixelFont.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              backgroundColor: "#2c2828",
              color: "white",
              borderRadius: "4px",
              fontSize: "10px",
              letterSpacing: "1px",
            },
          }}
        />
        <main className="flex h-fit w-full flex-col items-center justify-start">
          {showGameModal && <GameInProgress />}
          {children}
        </main>
      </body>
    </html>
  );
}
