"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
  ValorantBackground,
  AbstractShapes,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
} from "../../ui";
import { Project } from "@/server/db/schema";
import { ExternalLink, Github } from "lucide-react";
import { usePublicFeaturedProjects } from "@/hooks/usePublicProjects";

export const Projects: React.FC = () => {
  const { t } = useLanguage();
  const {
    data: projects = [],
    isLoading,
    error,
  } = usePublicFeaturedProjects(3);

  const projectIcons = [
    CodeIcon,
    RocketIcon,
    SparklesIcon,
    ShieldIcon,
    ZapIcon,
    TargetIcon,
  ];

  if (isLoading) {
    return (
      <ValorantBackground variant="geometric" className="py-20">
        <Section
          id="projects"
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        >
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} variant="modern" className="animate-pulse">
                  <div className="h-48 glass-morphism rounded-lg mb-4"></div>
                  <div className="h-6 glass-morphism rounded mb-3"></div>
                  <div className="h-4 glass-morphism rounded mb-2"></div>
                  <div className="h-4 glass-morphism rounded mb-2"></div>
                  <div className="h-4 glass-morphism rounded w-3/4 mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 glass-morphism rounded w-16"></div>
                    <div className="h-6 glass-morphism rounded w-20"></div>
                  </div>
                  <div className="h-10 glass-morphism rounded"></div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </ValorantBackground>
    );
  }

  if (error) {
    return (
      <ValorantBackground variant="geometric" className="py-20">
        <Section
          id="projects"
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        >
          <Container>
            <EmptyState
              title="Unable to Load Projects"
              description="There was an error loading the projects. Please try again later."
            />
          </Container>
        </Section>
      </ValorantBackground>
    );
  }

  if (projects.length === 0) {
    return (
      <ValorantBackground variant="geometric" className="py-20">
        <Section
          id="projects"
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        >
          <Container>
            <EmptyState
              title="No Featured Projects Yet"
              description="Featured projects will appear here once they are added to the portfolio."
            />
          </Container>
        </Section>
      </ValorantBackground>
    );
  }

  return (
    <ValorantBackground variant="geometric" className="py-20">
      <Section
        id="projects"
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
      >
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const technologies = JSON.parse(project.technologies || "[]");
              const IconComponent = projectIcons[index % projectIcons.length];

              return (
                <Card
                  key={project.id}
                  variant="modern"
                  className="flex flex-col overflow-hidden hover-lift hover-glow"
                >
                  <div className="aspect-video glass-morphism flex items-center justify-center text-6xl relative overflow-hidden">
                    {project.image.startsWith("http") ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {project.image}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent"></div>
                    <div className="absolute top-2 right-2">
                      <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {project.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {technologies
                          .slice(0, 3)
                          .map((tech: string, techIndex: number) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 glass-morphism text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full border border-indigo-200/50 dark:border-indigo-700/50"
                            >
                              {tech}
                            </span>
                          ))}
                        {technologies.length > 3 && (
                          <span className="px-2 py-1 glass-morphism text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full border border-purple-200/50 dark:border-purple-700/50">
                            +{technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(project.githubUrl!, "_blank")
                          }
                        >
                          <Github className="w-4 h-4 mr-2" />
                          {t("projects.code")}
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button
                          variant="modern"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(project.liveUrl!, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t("projects.live")}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => (window.location.href = "/projects")}
              className="hover-lift"
            >
              {t("projects.viewAllProjects")}
            </Button>
          </div>
        </Container>
      </Section>
    </ValorantBackground>
  );
};
