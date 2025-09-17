"use client";

import React from "react";
import Image from "next/image";
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
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10 py-8 sm:py-12 lg:py-16">
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div
                className="inline-block mb-6 animate-fade-in"
                style={{ animationDelay: "100ms", animationFillMode: "both" }}
              >
                <div className="glass-morphism px-6 py-3 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105">
                  <CodeIcon className="w-4 h-4 mr-2 inline transition-transform duration-200 hover:rotate-12" />
                  {t("hero.greeting")}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white mb-6">
                <span
                  className="animate-fade-in-up"
                  style={{ animationDelay: "200ms", animationFillMode: "both" }}
                >
                  {t("hero.title")}
                </span>
                <span
                  className="block gradient-text animate-fade-in-up"
                  style={{ animationDelay: "400ms", animationFillMode: "both" }}
                >
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p
                className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-fade-in"
                style={{ animationDelay: "600ms", animationFillMode: "both" }}
              >
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button
                variant="modern"
                size="lg"
                className="w-full sm:w-auto animate-fade-in"
                style={{ animationDelay: "800ms", animationFillMode: "both" }}
              >
                {t("hero.viewWork")}
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto animate-fade-in"
                style={{ animationDelay: "1000ms", animationFillMode: "both" }}
              >
                {t("hero.contact")}
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div
              className="relative animate-fade-in-up"
              style={{ animationDelay: "1200ms", animationFillMode: "both" }}
            >
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 modern-card overflow-hidden hover-lift transition-all duration-500 hover:scale-105">
                <Image
                  src="/api/placeholder/400/400"
                  alt="Professional headshot"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent transition-opacity duration-300 hover:opacity-80"></div>
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-24 h-24 glass-morphism flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-110 animate-bounce-in"
                style={{ animationDelay: "1400ms", animationFillMode: "both" }}
              >
                <div className="text-center">
                  <RocketIcon className="w-6 h-6 mx-auto mb-1 transition-transform duration-200 hover:rotate-12" />
                  {t("hero.experienceYears")}
                </div>
              </div>
              <div
                className="absolute -top-6 -left-6 w-16 h-16 glass-morphism flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-110 animate-bounce-in"
                style={{ animationDelay: "1600ms", animationFillMode: "both" }}
              >
                <SparklesIcon className="w-4 h-4 transition-transform duration-200 hover:rotate-12" />
              </div>
              <div
                className="absolute top-1/2 -right-8 w-12 h-12 glass-morphism flex items-center justify-center text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-lg transition-all duration-300 hover:scale-110 animate-bounce-in"
                style={{ animationDelay: "1800ms", animationFillMode: "both" }}
              >
                <ZapIcon className="w-3 h-3 transition-transform duration-200 hover:rotate-12" />
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
