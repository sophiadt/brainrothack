import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: [
    {
      path: "./fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
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
      <body className={`${poppins.variable} antialiased`}>
        <header className="bg-[#25262A] text-white p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <img
                src="/assets/rizzlr.png"
                alt="Rizzlr Logo"
                className="w-8 h-10"
              />
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#7D36E5] to-[#BE4DFD] bg-clip-text text-transparent">
                Rizzlr.ai
              </h1>
            </div>
  
            {/* Search Bar */}
            <nav className="absolute left-1/2 transform -translate-x-1/2 w-96">
              <div className="relative flex items-center">
                {/* Magnifying Glass Icon */}
                <img
                  src="/assets/magnifying-glass.png"
                  alt="Search Icon"
                  className="absolute left-3 w-4 h-4"
                />
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search Characters"
                  className="rounded-full bg-[#3B3D43] text-white pl-10 pr-4 py-2 w-full placeholder-[#979797] font-semibold focus:outline-none focus:ring-2 focus:ring-[#7D36E5]"
                />
              </div>
            </nav>
  
            {/* Right Section: Aura Points and Account Info */}
            <div className="flex items-center space-x-4">
              {/* Aura Points Button */}
              <button className="bg-[#BE4DFD] text-sm px-4 py-2 rounded-full">
                0 Aura Points
              </button>
  
              {/* Account Info */}
              <div className="flex items-center space-x-2">
                {/* Profile Picture */}
                <img
                  src="/assets/professional-gooner-pfp.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                {/* Username */}
                <span className="text-sm font-medium">professionalgooner</span>
                {/* Dropdown Arrow */}
                <img
                  src="/assets/arrow.png"
                  alt="Dropdown Arrow"
                  className="w-7 h-4"
                />
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}