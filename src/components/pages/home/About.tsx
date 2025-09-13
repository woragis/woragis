"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  ValorantBackground,
  AbstractShapes,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
} from "../../ui";

export const About: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t("about.stats.yearsExperience"), value: "5+", icon: RocketIcon },
    { label: t("about.stats.projectsCompleted"), value: "50+", icon: CodeIcon },
    { label: t("about.stats.technologies"), value: "15+", icon: SparklesIcon },
    { label: t("about.stats.happyClients"), value: "30+", icon: ShieldIcon },
  ];

  return (
    <ValorantBackground variant="abstract" className="py-20">
      <Section
        id="about"
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                {t("heading")}
              </h3>
              <div className="space-y-6 text-slate-600 dark:text-slate-300">
                <p className="text-lg leading-relaxed">{t("description1")}</p>
                <p className="text-lg leading-relaxed">{t("description2")}</p>
                <p className="text-lg leading-relaxed">{t("description3")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card
                    key={index}
                    variant="glass"
                    className="text-center hover-lift hover-glow"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 glass-morphism rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 gradient-text">
                        {stat.value}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-sm font-medium">
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
    </ValorantBackground>
  );
};
