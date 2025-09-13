"use client";

import React from "react";
import { Experience } from "@/types";
import { ExperienceCard } from "./ExperienceCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExperienceListProps {
  experiences: Experience[];
  isLoading?: boolean;
  error?: Error | null;
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  isLoading = false,
  error = null,
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-grow space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p className="text-lg">
          {t("experience.errorLoading") || "Failed to load experience data"}
        </p>
      </div>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p className="text-lg">
          {t("experience.noExperience") || "No experience entries available"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {experiences.map((experience, index) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          index={index}
        />
      ))}
    </div>
  );
};
