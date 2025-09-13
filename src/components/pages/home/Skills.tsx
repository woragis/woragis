"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  ValorantBackground,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
} from "../../ui";

export const Skills: React.FC = () => {
  const { t } = useLanguage();

  const skillCategories = [
    {
      title: t("skills.categories.frontend"),
      skills: [
        { name: "React", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "Tailwind CSS", level: 90 },
        { name: "Vue.js", level: 75 },
      ],
      icon: CodeIcon,
    },
    {
      title: t("skills.categories.backend"),
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Python", level: 85 },
        { name: "PostgreSQL", level: 80 },
        { name: "MongoDB", level: 75 },
        { name: "Redis", level: 70 },
      ],
      icon: RocketIcon,
    },
    {
      title: t("skills.categories.tools"),
      skills: [
        { name: "Git", level: 95 },
        { name: "Docker", level: 80 },
        { name: "AWS", level: 75 },
        { name: "Linux", level: 85 },
        { name: "Figma", level: 70 },
      ],
      icon: SparklesIcon,
    },
  ];

  return (
    <ValorantBackground variant="minimal" className="py-20">
      <Section
        id="skills"
        title={t("skills.title")}
        subtitle={t("skills.subtitle")}
      >
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={categoryIndex}
                  variant="modern"
                  className="hover-lift hover-glow"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 glass-morphism rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {category.title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {skill.name}
                          </span>
                          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </ValorantBackground>
  );
};
