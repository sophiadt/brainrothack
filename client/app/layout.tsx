import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Rizzlr.ai",
  description: "Do you have what it takes?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-gray-900 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-lg font-bold">Rizzlr.ai</h1>
            <nav className="flex space-x-6">
              <a href="/" className="hover:text-purple-400">
                Home
              </a>
              <a href="/call" className="hover:text-purple-400">
                Call
              </a>
              <a href="/profile" className="hover:text-purple-400">
                Profile
              </a>
            </nav>
            <button className="bg-purple-500 text-sm px-4 py-2 rounded-full">
              0 Aura Points
            </button>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
