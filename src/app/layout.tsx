import type { Metadata } from "next";
import { Orbitron, Press_Start_2P, Rajdhani } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navigation, Footer } from "@/components/pages/home";
import { ClientOnly } from "@/components/ClientOnly";
import { QueryClientProviderWrapper } from "@/components/QueryClientProvider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: ["400"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Developer Portfolio | Full-Stack Developer",
  description:
    "Passionate full-stack developer crafting innovative solutions with modern technologies. Specializing in React, Node.js, TypeScript, and cloud technologies. 5+ years of experience building scalable web applications.",
  keywords: [
    "full-stack developer",
    "react developer",
    "typescript",
    "node.js",
    "next.js",
    "web development",
    "frontend developer",
    "backend developer",
    "software engineer",
    "portfolio",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://yourportfolio.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Developer Portfolio | Full-Stack Developer",
    description:
      "Passionate full-stack developer crafting innovative solutions with modern technologies. Specializing in React, Node.js, TypeScript, and cloud technologies.",
    url: "https://yourportfolio.com",
    siteName: "Developer Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Portfolio | Full-Stack Developer",
    description:
      "Passionate full-stack developer crafting innovative solutions with modern technologies.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${pressStart2P.variable} ${rajdhani.variable} antialiased`}
      >
        <QueryClientProviderWrapper>
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
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
