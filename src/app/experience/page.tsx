"use client";

import { usePublicExperience } from "@/hooks/usePublicExperience";
import { Section, Container, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ExperiencePage() {
  const { t } = useLanguage();
  const { data: experiences, isLoading, error } = usePublicExperience();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <Container>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
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
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("experience.title")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t("experience.errorLoading") || "Failed to load experience data"}
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("experience.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("experience.subtitle")}
          </p>
        </div>

        <div className="space-y-8">
          {experiences && experiences.length > 0 ? (
            experiences.map((experience) => (
              <Card key={experience.id} hover className="relative">
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

                    {experience.achievements &&
                      experience.achievements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {t("experience.keyAchievements")}:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            {experience.achievements.map(
                              (achievement, achIndex) => (
                                <li key={achIndex} className="text-sm">
                                  {achievement}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {experience.technologies &&
                      experience.technologies.length > 0 && (
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
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">
                {t("experience.noExperience") ||
                  "No experience entries available"}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
