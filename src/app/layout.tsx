import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navigation, Footer } from "@/components/pages/home";
import { ClientOnly } from "@/components/ClientOnly";
import { QueryClientProviderWrapper } from "@/components/QueryClientProvider";
import { ChatWidget } from "@/components/ui/chat-widget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Woragis | Developer Portfolio",
  description:
    "Professional full-stack developer crafting innovative solutions with modern technologies. Specializing in React, Node.js, TypeScript, and cloud technologies. 5+ years of experience building scalable web applications.",
  keywords: [
    "full-stack developer",
    "react developer",
    "typescript",
    "node.js",
    "next.js",
    "nodejs",
    "nextjs",
    "svelte",
    "sveltekit",
    "tailwindcss",
    "tailwind",
    "shadcn",
    "shadcn/ui",
    "tailwindcss",
    "tailwind",
    "shadcn",
    "shadcn/ui",
    "golang",
    "go",
    "rust",
    "python",
    "javascript",
    "typescript",
    "js",
    "ts",
    "react",
    "reactjs",
    "react.js",
    "express",
    "expressjs",
    "express.js",
    "mongodb",
    "postgresql",
    "redis",
    "web development",
    "crypto development",
    "blockchain development",
    "blockchain",
    "blockchain developer",
    "blockchain developer portfolio",
    "blockchain development portfolio",
    "web3",
    "web3 development",
    "web3 developer",
    "web3 development portfolio",
    "web3 developer portfolio",
    "frontend developer",
    "backend developer",
    "software engineer",
    "software engineer portfolio",
    "portfolio",
  ],
  authors: [{ name: "Woragis" }],
  creator: "Woragis",
  publisher: "Woragis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.woragis.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Woragis | Developer Portfolio",
    description:
      "Professional full-stack developer crafting innovative solutions with modern technologies. Specializing in React, Node.js, TypeScript, and cloud technologies.",
    url: "https://www.woragis.me",
    siteName: "Woragis",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Woragis",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Woragis | Developer Portfolio",
    description:
      "Professional full-stack developer crafting innovative solutions with modern technologies.",
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
    google: "woragis-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  let theme;
                  
                  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    theme = savedTheme;
                  } else {
                    // If no saved theme, use system preference
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
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
              <ClientOnly>
                <ChatWidget />
              </ClientOnly>
            </ThemeProvider>
          </LanguageProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
