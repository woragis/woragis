import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navigation, Footer } from "@/components/home";
import { ClientOnly } from "@/components/ClientOnly";
import { QueryClientProviderWrapper } from "@/components/QueryClientProvider";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
