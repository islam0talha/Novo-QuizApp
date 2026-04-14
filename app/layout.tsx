import { Outfit } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Zero Bleeds Challenge | Novo Nordisk Quiz",
  description:
    "Test your knowledge on Hemophilia A management and the latest FRONTIER clinical data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(outfit.variable)}>
      <body>{children}</body>
    </html>
  );
}
