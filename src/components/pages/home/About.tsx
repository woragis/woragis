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

export const About: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t("about.stats.yearsExperience"), value: "5+" },
    { label: t("about.stats.projectsCompleted"), value: "50+" },
    { label: t("about.stats.technologies"), value: "15+" },
    { label: t("about.stats.happyClients"), value: "30+" },
  ];

  return (
    <GamingBackground variant="cyber" className="py-20">
      <Section
        id="about"
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-display font-black text-white mb-6 neon-text">
                {t("heading")}
              </h3>
              <div className="space-y-4 text-gray-300 font-sans">
                <p className="text-lg leading-relaxed">{t("description1")}</p>
                <p className="text-lg leading-relaxed">{t("description2")}</p>
                <p className="text-lg leading-relaxed">{t("description3")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const icons = [
                  TrophyIcon,
                  StarIcon,
                  PowerUpIcon,
                  ControllerIcon,
                ];
                const IconComponent = icons[index % icons.length];
                return (
                  <Card
                    key={index}
                    variant="gaming"
                    className="text-center gaming-hover pixel-hover"
                  >
                    <div className="flex flex-col items-center">
                      <IconComponent className="w-8 h-8 text-green-400 mb-3 animate-neon-pulse" />
                      <div className="text-3xl font-pixel font-bold text-green-400 mb-2 neon-text">
                        {stat.value}
                      </div>
                      <div className="text-gray-300 font-pixel text-sm">
                        {stat.label}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>
    </GamingBackground>
  );
};
