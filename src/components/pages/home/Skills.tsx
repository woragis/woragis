"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  GamingBackground,
  StarIcon,
  PowerUpIcon,
  ControllerIcon,
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
    },
  ];

  const categoryIcons = [ControllerIcon, PowerUpIcon, StarIcon];

  return (
    <GamingBackground variant="pixel" className="py-20">
      <Section
        id="skills"
        title={t("skills.title")}
        subtitle={t("skills.subtitle")}
      >
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => {
              const IconComponent =
                categoryIcons[categoryIndex % categoryIcons.length];
              return (
                <Card
                  key={categoryIndex}
                  variant="gaming"
                  className="h-fit gaming-hover pixel-hover"
                >
                  <div className="text-center mb-6">
                    <IconComponent className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-neon-pulse" />
                    <h3 className="text-xl font-pixel font-bold text-green-400 neon-text">
                      {category.title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="cyber-glow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 font-pixel font-bold text-sm">
                            {skill.name}
                          </span>
                          <span className="text-sm text-cyan-400 font-pixel font-bold">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600">
                          <div
                            className="bg-gradient-to-r from-green-400 via-cyan-400 to-pink-400 h-3 rounded-full transition-all duration-1000 ease-out gaming-pulse"
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
    </GamingBackground>
  );
};
