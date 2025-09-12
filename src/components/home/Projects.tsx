"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card, Button } from "../ui";
import { Project } from "@/server/db/schema";
import { ExternalLink, Github } from "lucide-react";

export const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch("/api/projects?featured=true&limit=3");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Section
        id="projects"
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
      >
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section
      id="projects"
      title={t("projects.title")}
      subtitle={t("projects.subtitle")}
    >
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const technologies = JSON.parse(project.technologies || "[]");

            return (
              <Card
                key={project.id}
                hover
                className="flex flex-col overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-6xl">
                  {project.image.startsWith("http") ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{project.image}</span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {technologies
                        .slice(0, 3)
                        .map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      {technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
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
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(project.liveUrl!, "_blank")}
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
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = "/projects")}
          >
            {t("projects.viewAllProjects")}
          </Button>
        </div>
      </Container>
    </Section>
  );
};
