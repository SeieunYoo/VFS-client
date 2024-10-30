import "./globals.css";

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
