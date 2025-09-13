"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicExperience } from "@/hooks/usePublicExperience";
import { Section, Container, Card } from "../../ui";
import { ExperienceList } from "../experience";

export const Experience: React.FC = () => {
  const { t } = useLanguage();
  const { data: experiences, isLoading, error } = usePublicExperience();

  return (
    <Section
      id="experience"
      title={t("experience.title")}
      subtitle={t("experience.subtitle")}
    >
      <Container>
        <ExperienceList
          experiences={experiences || []}
          isLoading={isLoading}
          error={error}
        />
      </Container>
    </Section>
  );
};
