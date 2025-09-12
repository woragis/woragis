"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button, Container } from "../ui";

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Container>
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6">
              {t("hero.greeting")}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              {t("hero.title")}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {t("hero.titleHighlight")}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto">
              {t("hero.viewWork")}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              {t("hero.getInTouch")}
            </Button>
          </div>

          <div className="mt-16">
            <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <span>{t("hero.scrollToExplore")}</span>
              <div className="animate-bounce">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
