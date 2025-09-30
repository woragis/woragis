"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IntlProvider } from "next-intl";
import type { SupportedLanguage } from "@/types";

export type Language = SupportedLanguage;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getTranslatedContent: <T>(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    contentId: string,
    fallbackToDefault?: boolean
  ) => Promise<T | null>;
  isTranslationLoading: boolean;
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
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);

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

  const getTranslatedContent = async <T,>(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    contentId: string,
    fallbackToDefault: boolean = true
  ): Promise<T | null> => {
    setIsTranslationLoading(true);
    try {
      const response = await fetch(
        `/api/translations/${contentType}/${contentId}?lang=${language}&fallback=${fallbackToDefault}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch translation: ${response.statusText}`);
      }

      const result = await response.json();
      setIsTranslationLoading(false);
      return result.data?.content || null;
    } catch (error) {
      console.error("Error fetching translated content:", error);
      setIsTranslationLoading(false);
      return null;
    }
  };

  // Always provide the context, but handle hydration carefully
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      getTranslatedContent,
      isTranslationLoading 
    }}>
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
