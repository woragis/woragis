"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Button,
  Container,
  ControllerIcon,
  StarIcon,
  TrophyIcon,
  PowerUpIcon,
  PixelGrid,
  NeonBorder,
  GamingBackground,
  MatrixRain,
} from "../../ui";

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <GamingBackground
      variant="matrix"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Matrix rain effect */}
      <MatrixRain />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 bg-cyan-400 animate-pulse">
          <ControllerIcon className="w-full h-full text-cyan-400" />
        </div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-green-400 animate-pulse delay-1000">
          <StarIcon className="w-full h-full text-green-400" />
        </div>
        <div className="absolute bottom-20 left-1/4 w-5 h-5 bg-pink-400 animate-pulse delay-2000">
          <TrophyIcon className="w-full h-full text-pink-400" />
        </div>
        <div className="absolute bottom-40 right-1/3 w-6 h-6 bg-yellow-400 animate-pulse delay-500">
          <PowerUpIcon className="w-full h-full text-yellow-400" />
        </div>
        <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-purple-400 animate-pulse delay-1500">
          <ControllerIcon className="w-full h-full text-purple-400" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-400 animate-pulse delay-3000">
          <StarIcon className="w-full h-full text-red-400" />
        </div>
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <NeonBorder className="inline-block mb-6">
                <div className="px-6 py-3 text-green-400 font-pixel text-sm animate-neon-pulse flex items-center">
                  <ControllerIcon className="w-4 h-4 mr-2" />
                  {t("hero.greeting")}
                </div>
              </NeonBorder>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white mb-6">
                <span className="animate-fade-in-up neon-text">
                  {t("hero.title")}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-pink-400 animate-fade-in-up-delay animate-gradient">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto lg:mx-0 mb-8 leading-relaxed font-sans">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button className="retro-button px-8 py-4 text-lg w-full sm:w-auto gaming-hover pixel-hover">
                {t("hero.viewWork")}
              </button>
              <button className="retro-button px-8 py-4 text-lg w-full sm:w-auto gaming-hover pixel-hover border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
                {t("hero.getInTouch")}
              </button>
              <button className="retro-button px-8 py-4 text-lg w-full sm:w-auto gaming-hover pixel-hover border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-black flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t("hero.downloadResume")}
              </button>
            </div>
          </div>

          {/* Gaming-style Photo Display */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 gameboy-screen overflow-hidden animate-gameboy-screen gaming-hover cyber-glow">
                <img
                  src="/api/placeholder/400/400"
                  alt="Professional headshot"
                  className="w-full h-full object-cover filter contrast-110 brightness-110"
                />
                {/* Pixel overlay effect */}
                <div className="absolute inset-0 pixel-grid opacity-30"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 gaming-card flex items-center justify-center text-green-400 text-lg font-pixel gaming-pulse">
                <div className="text-center">
                  <TrophyIcon className="w-6 h-6 mx-auto mb-1" />
                  {t("hero.experienceYears")}
                </div>
              </div>
              {/* Gaming UI elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full animate-pulse delay-500"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          <div className="mt-16">
            <div className="inline-flex items-center space-x-2 text-cyan-400 font-pixel text-sm">
              <span className="neon-flicker">{t("hero.scrollToExplore")}</span>
              <div className="animate-bounce retro-bounce">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </GamingBackground>
  );
};
