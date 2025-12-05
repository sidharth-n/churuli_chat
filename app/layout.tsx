import type { Metadata } from "next";
import { Noto_Sans_Malayalam, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const malayalam = Noto_Sans_Malayalam({ subsets: ["malayalam"], variable: "--font-malayalam" });
const mono = Space_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Thankan Chettan | Churuli Chatbot",
  description: "Experience the mystery of Churuli with Thankan Chettan. A unique AI chatbot experience.",
  openGraph: {
    title: "Thankan Chettan | Churuli Chatbot",
    description: "Experience the mystery of Churuli with Thankan Chettan. A unique AI chatbot experience.",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Thankan Chettan Profile",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${malayalam.variable} ${mono.variable} font-sans antialiased bg-deep-black text-white overflow-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
