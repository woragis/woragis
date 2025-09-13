"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Button,
  Container,
  ValorantBackground,
  AbstractShapes,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
} from "../../ui";

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ValorantBackground
      variant="geometric"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Abstract geometric shapes */}
      <AbstractShapes />

      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-block mb-6">
                <div className="glass-morphism px-6 py-3 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-full">
                  <CodeIcon className="w-4 h-4 mr-2 inline" />
                  {t("hero.greeting")}
                </div>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
                <span className="animate-fade-in-up">{t("hero.title")}</span>
                <span className="block gradient-text animate-fade-in-up-delay">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button variant="modern" size="lg" className="w-full sm:w-auto">
                {t("hero.viewWork")}
              </Button>
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                {t("hero.contact")}
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 modern-card overflow-hidden hover-lift">
                <img
                  src="/api/placeholder/400/400"
                  alt="Professional headshot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 glass-morphism flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg font-semibold rounded-xl">
                <div className="text-center">
                  <RocketIcon className="w-6 h-6 mx-auto mb-1" />
                  {t("hero.experienceYears")}
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-16 h-16 glass-morphism flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-semibold rounded-lg">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 glass-morphism flex items-center justify-center text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-lg">
                <ZapIcon className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
            <span className="animate-pulse">{t("hero.scrollToExplore")}</span>
            <div className="animate-bounce">
              <svg
                className="w-5 h-5"
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
      </Container>
    </ValorantBackground>
  );
};
