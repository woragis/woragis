"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IntlProvider } from "next-intl";

export type Language = "en" | "es" | "pt" | "it" | "fr" | "ja" | "zh" | "ko";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  it: "Italiano",
  fr: "Français",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
};

const languageFlags: Record<Language, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  pt: "🇵🇹",
  it: "🇮🇹",
  fr: "🇫🇷",
  ja: "🇯🇵",
  zh: "🇨🇳",
  ko: "🇰🇷",
};

// Import all translation files
const translations = {
  en: () => import("../messages/en.json"),
  es: () => import("../messages/es.json"),
  pt: () => import("../messages/pt.json"),
  it: () => import("../messages/it.json"),
  fr: () => import("../messages/fr.json"),
  ja: () => import("../messages/ja.json"),
  zh: () => import("../messages/zh.json"),
  ko: () => import("../messages/ko.json"),
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && Object.keys(languageNames).includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
      setIsHydrated(true);
    }
  }, []);

  // Load messages when language changes
  useEffect(() => {
    translations[language]().then((module) => {
      setMessages(module.default);
    });
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: string | Record<string, string> = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, string>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  // Always provide the context, but handle hydration carefully
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <IntlProvider messages={messages} locale={language}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { languageNames, languageFlags };
