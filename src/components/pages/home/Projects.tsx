"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
  GamingBackground,
  StarIcon,
  TrophyIcon,
  PowerUpIcon,
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

  if (isLoading) {
    return (
      <GamingBackground variant="retro" className="py-20">
        <Section
          id="projects"
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        >
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} variant="gaming" className="animate-pulse">
                  <div className="h-48 gaming-card rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-6 gaming-card rounded mb-3"></div>
                    <div className="h-4 gaming-card rounded mb-2"></div>
                    <div className="h-4 gaming-card rounded w-3/4 mb-4"></div>
                    <div className="flex space-x-2 mb-4">
                      <div className="h-6 gaming-card rounded w-16"></div>
                      <div className="h-6 gaming-card rounded w-20"></div>
                    </div>
                    <div className="h-10 gaming-card rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </GamingBackground>
    );
  }

  if (error) {
    return (
      <GamingBackground variant="retro" className="py-20">
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
      </GamingBackground>
    );
  }

  if (projects.length === 0) {
    return (
      <GamingBackground variant="retro" className="py-20">
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
      </GamingBackground>
    );
  }

  const projectIcons = [StarIcon, TrophyIcon, PowerUpIcon];

  return (
    <GamingBackground variant="retro" className="py-20">
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
                  variant="gaming"
                  className="flex flex-col overflow-hidden gaming-hover pixel-hover"
                >
                  <div className="aspect-video gaming-card flex items-center justify-center text-6xl relative overflow-hidden">
                    {project.image.startsWith("http") ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover filter contrast-110 brightness-110"
                      />
                    ) : (
                      <span className="text-green-400 font-pixel">
                        {project.image}
                      </span>
                    )}
                    <div className="absolute inset-0 pixel-grid opacity-20"></div>
                    <div className="absolute top-2 right-2">
                      <IconComponent className="w-6 h-6 text-cyan-400 animate-neon-pulse" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-pixel font-bold text-green-400 neon-text mb-3">
                      {project.title}
                    </h3>

                    <p className="text-gray-300 mb-4 flex-grow font-sans leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {technologies
                          .slice(0, 3)
                          .map((tech: string, techIndex: number) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 gaming-card text-cyan-400 text-xs font-pixel font-bold border border-cyan-400/30"
                            >
                              {tech}
                            </span>
                          ))}
                        {technologies.length > 3 && (
                          <span className="px-2 py-1 gaming-card text-pink-400 text-xs font-pixel font-bold border border-pink-400/30">
                            +{technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button
                          variant="cyber"
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
                          variant="neon"
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
              variant="retro"
              size="lg"
              onClick={() => (window.location.href = "/projects")}
              className="gaming-hover pixel-hover"
            >
              {t("projects.viewAllProjects")}
            </Button>
          </div>
        </Container>
      </Section>
    </GamingBackground>
  );
};
