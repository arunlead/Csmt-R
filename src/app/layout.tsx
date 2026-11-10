import type { Metadata } from "next";
import { Unbounded, Instrument_Sans, JetBrains_Mono } from "next/font/google";import "./globals.css";
import SmoothScroll from "@/lib/SmoothScroll";
import Navbar from "@/components/Navbar";
const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  weight: ["500", "700", "900"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "CSMT | Cybersecurity and Media Tech",
  description:
    "CSMT creates secure websites, software and IT systems, and teaches ethical hacking and cybersecurity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html
  lang="en"
  className={`${unbounded.variable} ${instrument.variable} ${jetbrains.variable}`}
>
    <body>
  <Navbar />
  <SmoothScroll>{children}</SmoothScroll>
</body>
    </html>
  );
}