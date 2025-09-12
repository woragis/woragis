import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navigation, Footer } from "@/components/home";
import { ClientOnly } from "@/components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Developer Portfolio | Full-Stack Developer",
  description:
    "Passionate full-stack developer crafting innovative solutions with modern technologies. Specializing in React, Node.js, and cloud technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider>
            <ClientOnly>
              <Navigation />
            </ClientOnly>
            <main className="min-h-screen">{children}</main>
            <ClientOnly>
              <Footer />
            </ClientOnly>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
