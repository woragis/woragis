"use client";

import React from "react";
import { Card } from "../ui";
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

  return (
    <Card hover className="relative">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Timeline indicator */}
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full text-2xl">
          {experience.icon}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {experience.title}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">
                {experience.company}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 lg:mt-0">
              <p>{experience.period}</p>
              <p>{experience.location}</p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {experience.description}
          </p>

          {experience.achievements && experience.achievements.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t("experience.keyAchievements")}:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                {experience.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="text-sm">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {experience.technologies && experience.technologies.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t("experience.technologies")}:
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
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
