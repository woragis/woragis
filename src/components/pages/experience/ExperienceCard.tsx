"use client";

import React from "react";
import { Card } from "../../ui";
import { Experience } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
  CodeIcon,
} from "../../ui/AbstractIcons";

interface ExperienceCardProps {
  experience: Experience;
  index?: number;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index = 0,
}) => {
  const { t } = useLanguage();

  const icons = [
    RocketIcon,
    SparklesIcon,
    ShieldIcon,
    ZapIcon,
    TargetIcon,
    CodeIcon,
  ];
  const IconComponent = icons[index % icons.length];

  return (
    <Card
      variant="modern"
      className="hover-lift hover-glow animate-fade-in-up"
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Timeline indicator */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-16 h-16 glass-morphism rounded-full transition-all duration-300 hover:scale-110 animate-bounce-in"
          style={{
            animationDelay: `${index * 200 + 100}ms`,
            animationFillMode: "both",
          }}
        >
          <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400 transition-transform duration-200 hover:rotate-12" />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 animate-fade-in"
            style={{
              animationDelay: `${index * 200 + 200}ms`,
              animationFillMode: "both",
            }}
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-200">
                {experience.title}
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold transition-colors duration-200">
                {experience.company}
              </p>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 lg:mt-0">
              <p className="text-purple-600 dark:text-purple-400 font-medium transition-colors duration-200">
                {experience.period}
              </p>
              <p className="text-slate-600 dark:text-slate-300 transition-colors duration-200">
                {experience.location}
              </p>
            </div>
          </div>

          <p
            className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed transition-colors duration-200 animate-fade-in"
            style={{
              animationDelay: `${index * 200 + 300}ms`,
              animationFillMode: "both",
            }}
          >
            {experience.description}
          </p>

          {experience.achievements && experience.achievements.length > 0 && (
            <div
              className="mb-4 animate-fade-in"
              style={{
                animationDelay: `${index * 200 + 400}ms`,
                animationFillMode: "both",
              }}
            >
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 transition-colors duration-200">
                {t("experience.keyAchievements")}:
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {experience.achievements.map((achievement, achIndex) => (
                  <li
                    key={achIndex}
                    className="text-sm flex items-start transition-all duration-200 hover:translate-x-2"
                  >
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold transition-transform duration-200 hover:scale-110">
                      ▶
                    </span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {experience.technologies && experience.technologies.length > 0 && (
            <div
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 200 + 500}ms`,
                animationFillMode: "both",
              }}
            >
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 transition-colors duration-200">
                {t("experience.technologies")}:
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 glass-morphism text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-full border border-indigo-200/50 dark:border-indigo-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 hover:scale-105 animate-fade-in"
                    style={{
                      animationDelay: `${index * 200 + 600 + techIndex * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
