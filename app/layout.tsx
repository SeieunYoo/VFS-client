/* eslint-disable react/function-component-definition */
import "./globals.css";

import type { Metadata } from "next/types";

declare global {
  interface Window {
    kakao: any;
  }
}

export const metadata: Metadata = {
  title: "TryOnMe | 내 맘대로 옷 입어봐",
  description: "가상 옷 피팅 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main
          className="relative 
          left-0 
          p-5 
          pt-0
          lg:max-w-[412px]
          w-full 
          bg-white
          mx-auto
          shadow-lg
          min-h-[100dvh]
        "
        >
          {children}
        </main>
      </body>
    </html>
  );
}
