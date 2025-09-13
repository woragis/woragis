"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  GamingBackground,
  StarIcon,
  TrophyIcon,
  PowerUpIcon,
  ControllerIcon,
} from "../../ui";

export const Certifications: React.FC = () => {
  const { t } = useLanguage();

  const certifications = [
    {
      title: t("certifications.items.aws.title"),
      issuer: t("certifications.items.aws.issuer"),
      date: t("certifications.items.aws.date"),
      credential: t("certifications.items.aws.credential"),
      icon: "☁️",
    },
    {
      title: t("certifications.items.react.title"),
      issuer: t("certifications.items.react.issuer"),
      date: t("certifications.items.react.date"),
      credential: t("certifications.items.react.credential"),
      icon: "⚛️",
    },
    {
      title: t("certifications.items.typescript.title"),
      issuer: t("certifications.items.typescript.issuer"),
      date: t("certifications.items.typescript.date"),
      credential: t("certifications.items.typescript.credential"),
      icon: "📘",
    },
    {
      title: t("certifications.items.docker.title"),
      issuer: t("certifications.items.docker.issuer"),
      date: t("certifications.items.docker.date"),
      credential: t("certifications.items.docker.credential"),
      icon: "🐳",
    },
  ];

  const education = [
    {
      degree: t("education.items.computerScience.degree"),
      school: t("education.items.computerScience.school"),
      year: t("education.items.computerScience.year"),
      description: t("education.items.computerScience.description"),
      icon: "🎓",
    },
  ];

  const certIcons = [StarIcon, TrophyIcon, PowerUpIcon, ControllerIcon];

  return (
    <GamingBackground variant="cyber" className="py-20">
      <Section
        id="certifications"
        title={t("certifications.title")}
        subtitle={t("certifications.subtitle")}
      >
        <Container>
          <div className="space-y-16">
            {/* Education */}
            <div>
              <h3 className="text-2xl font-pixel font-bold text-green-400 neon-text mb-8 text-center">
                {t("education.title")}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {education.map((edu, index) => {
                  const IconComponent = certIcons[index % certIcons.length];
                  return (
                    <Card
                      key={index}
                      variant="gaming"
                      className="text-center gaming-hover pixel-hover"
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-4">{edu.icon}</div>
                        <IconComponent className="w-6 h-6 text-cyan-400 mb-2 animate-neon-pulse" />
                        <h4 className="text-xl font-pixel font-bold text-green-400 neon-text mb-2">
                          {edu.degree}
                        </h4>
                        <p className="text-cyan-400 font-pixel font-bold mb-2">
                          {edu.school}
                        </p>
                        <p className="text-gray-300 text-sm mb-2 font-sans">
                          {edu.year}
                        </p>
                        <p className="text-gray-300 text-sm font-sans">
                          {edu.description}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-pixel font-bold text-green-400 neon-text mb-8 text-center">
                {t("certifications.certificationsTitle")}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications.map((cert, index) => {
                  const IconComponent = certIcons[index % certIcons.length];
                  return (
                    <Card
                      key={index}
                      variant="gaming"
                      className="text-center gaming-hover pixel-hover"
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-4">{cert.icon}</div>
                        <IconComponent className="w-6 h-6 text-pink-400 mb-2 animate-neon-pulse" />
                        <h4 className="text-lg font-pixel font-bold text-green-400 neon-text mb-2">
                          {cert.title}
                        </h4>
                        <p className="text-cyan-400 font-pixel font-bold mb-2">
                          {cert.issuer}
                        </p>
                        <p className="text-gray-300 text-sm mb-2 font-sans">
                          {cert.date}
                        </p>
                        <p className="text-xs text-gray-400 font-pixel">
                          {cert.credential}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </GamingBackground>
  );
};
