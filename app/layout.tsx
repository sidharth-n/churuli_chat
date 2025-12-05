import type { Metadata } from "next";
import { Noto_Sans_Malayalam, Space_Mono } from "next/font/google";
import "./globals.css";

const notoSansMalayalam = Noto_Sans_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Thankan.andi - Churuli Chatbot",
  description: "The Labyrinth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansMalayalam.variable} ${spaceMono.variable} antialiased bg-black text-gray-200 overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
