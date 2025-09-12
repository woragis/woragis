"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card } from "../ui";

export const Experience: React.FC = () => {
  const { t } = useLanguage();

  const experiences = [
    {
      title: t("experience.items.seniorDeveloper.title"),
      company: t("experience.items.seniorDeveloper.company"),
      period: t("experience.items.seniorDeveloper.period"),
      location: t("experience.items.seniorDeveloper.location"),
      description: t("experience.items.seniorDeveloper.description"),
      achievements: [
        t("experience.items.seniorDeveloper.achievements.0"),
        t("experience.items.seniorDeveloper.achievements.1"),
        t("experience.items.seniorDeveloper.achievements.2"),
      ],
      technologies: ["React", "TypeScript", "Node.js", "AWS", "Docker"],
      icon: "💼",
    },
    {
      title: t("experience.items.fullStackDeveloper.title"),
      company: t("experience.items.fullStackDeveloper.company"),
      period: t("experience.items.fullStackDeveloper.period"),
      location: t("experience.items.fullStackDeveloper.location"),
      description: t("experience.items.fullStackDeveloper.description"),
      achievements: [
        t("experience.items.fullStackDeveloper.achievements.0"),
        t("experience.items.fullStackDeveloper.achievements.1"),
        t("experience.items.fullStackDeveloper.achievements.2"),
      ],
      technologies: ["Vue.js", "Python", "PostgreSQL", "Redis", "Docker"],
      icon: "🚀",
    },
    {
      title: t("experience.items.frontendDeveloper.title"),
      company: t("experience.items.frontendDeveloper.company"),
      period: t("experience.items.frontendDeveloper.period"),
      location: t("experience.items.frontendDeveloper.location"),
      description: t("experience.items.frontendDeveloper.description"),
      achievements: [
        t("experience.items.frontendDeveloper.achievements.0"),
        t("experience.items.frontendDeveloper.achievements.1"),
        t("experience.items.frontendDeveloper.achievements.2"),
      ],
      technologies: ["React", "JavaScript", "CSS3", "Webpack", "Git"],
      icon: "🎨",
    },
  ];

  return (
    <Section
      id="experience"
      title={t("experience.title")}
      subtitle={t("experience.subtitle")}
    >
      <Container>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} hover className="relative">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Timeline indicator */}
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full text-2xl">
                  {exp.icon}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 lg:mt-0">
                      <p>{exp.period}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {exp.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t("experience.keyAchievements")}:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="text-sm">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t("experience.technologies")}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
