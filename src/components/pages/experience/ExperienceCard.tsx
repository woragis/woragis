"use client";

import React from "react";
import { Card, TrophyIcon, StarIcon, PowerUpIcon } from "../../ui";
import { Experience } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExperienceCardProps {
  experience: Experience;
  index?: number;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index = 0,
}) => {
  const { t } = useLanguage();

  const icons = [TrophyIcon, StarIcon, PowerUpIcon];
  const IconComponent = icons[index % icons.length];

  return (
    <Card variant="gaming" className="relative gaming-hover pixel-hover">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Timeline indicator */}
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 gaming-card rounded-full text-2xl gaming-pulse">
          <IconComponent className="w-8 h-8 text-green-400" />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h3 className="text-xl font-pixel font-bold text-green-400 neon-text mb-2">
                {experience.title}
              </h3>
              <p className="text-cyan-400 font-pixel font-bold">
                {experience.company}
              </p>
            </div>
            <div className="text-sm text-gray-300 font-pixel mt-2 lg:mt-0">
              <p className="text-pink-400">{experience.period}</p>
              <p className="text-gray-400">{experience.location}</p>
            </div>
          </div>

          <p className="text-gray-300 mb-4 font-sans leading-relaxed">
            {experience.description}
          </p>

          {experience.achievements && experience.achievements.length > 0 && (
            <div className="mb-4">
              <h4 className="font-pixel font-bold text-green-400 mb-3 neon-text">
                {t("experience.keyAchievements")}:
              </h4>
              <ul className="space-y-2 text-gray-300">
                {experience.achievements.map((achievement, achIndex) => (
                  <li
                    key={achIndex}
                    className="text-sm font-sans flex items-start"
                  >
                    <span className="text-cyan-400 mr-2 font-pixel">▶</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {experience.technologies && experience.technologies.length > 0 && (
            <div>
              <h4 className="font-pixel font-bold text-green-400 mb-3 neon-text">
                {t("experience.technologies")}:
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 gaming-card text-cyan-400 text-sm font-pixel font-bold border border-cyan-400/30 hover:border-cyan-400 transition-colors"
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
