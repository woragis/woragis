"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card } from "../ui";

export const About: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t("about.stats.yearsExperience"), value: "5+" },
    { label: t("about.stats.projectsCompleted"), value: "50+" },
    { label: t("about.stats.technologies"), value: "15+" },
    { label: t("about.stats.happyClients"), value: "30+" },
  ];

  return (
    <Section id="about" title={t("about.title")} subtitle={t("about.subtitle")}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("heading")}
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
              <p>{t("description3")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};
