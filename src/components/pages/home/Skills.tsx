"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicFrameworks } from "@/hooks/usePublicFrameworks";
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
import type { Framework, FrameworkType } from "@/types";

export const Skills: React.FC = () => {
  const { t } = useLanguage();
  
  // Fetch all visible frameworks from the API
  const { data: frameworks, isLoading, error } = usePublicFrameworks();

  // Group frameworks by category (frontend, backend, tools)
  // Since the database only has "framework" and "language" types,
  // we'll create a mapping based on framework names and types
  const groupFrameworksByCategory = (frameworks: Framework[] | undefined) => {
    if (!frameworks) return { frontend: [], backend: [], tools: [] };

    const frontendFrameworks = [
      'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby', 'tailwind', 'css', 'html', 'javascript', 'typescript', 'sass', 'less', 'styled-components', 'emotion', 'chakra-ui', 'material-ui', 'ant-design', 'bootstrap'
    ];
    
    const backendFrameworks = [
      'node.js', 'express', 'fastify', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'c#', 'asp.net', 'php', 'laravel', 'symfony', 'ruby', 'rails', 'go', 'rust', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch'
    ];

    const frameworksByCategory = {
      frontend: [] as Framework[],
      backend: [] as Framework[],
      tools: [] as Framework[]
    };

    frameworks.forEach(framework => {
      const name = framework.name.toLowerCase();
      const isFrontend = frontendFrameworks.some(f => name.includes(f));
      const isBackend = backendFrameworks.some(f => name.includes(f));
      
      // If framework type is explicitly "tool", always put it in tools category
      if (framework.type === "tool") {
        frameworksByCategory.tools.push(framework);
      } else if (isFrontend) {
        frameworksByCategory.frontend.push(framework);
      } else if (isBackend) {
        frameworksByCategory.backend.push(framework);
      } else {
        frameworksByCategory.tools.push(framework);
      }
    });

    return frameworksByCategory;
  };

  const frameworksByCategory = groupFrameworksByCategory(frameworks as Framework[]);

  // Define skill categories
  const skillCategories = [
    {
      title: t("skills.categories.frontend"),
      type: "frontend" as const,
      icon: CodeIcon,
    },
    {
      title: t("skills.categories.backend"),
      type: "backend" as const,
      icon: RocketIcon,
    },
    {
      title: t("skills.categories.tools"),
      type: "tools" as const,
      icon: SparklesIcon,
    },
  ];

  // Fallback data in case API fails or returns empty data
  const fallbackSkills = {
    frontend: [
      { name: "React", icon: null, website: null },
      { name: "TypeScript", icon: null, website: null },
      { name: "Next.js", icon: null, website: null },
      { name: "Tailwind CSS", icon: null, website: null },
      { name: "Vue.js", icon: null, website: null },
    ],
    backend: [
      { name: "Node.js", icon: null, website: null },
      { name: "Python", icon: null, website: null },
      { name: "PostgreSQL", icon: null, website: null },
      { name: "MongoDB", icon: null, website: null },
      { name: "Redis", icon: null, website: null },
    ],
    tools: [
      { name: "Git", icon: null, website: null },
      { name: "Docker", icon: null, website: null },
      { name: "AWS", icon: null, website: null },
      { name: "Linux", icon: null, website: null },
      { name: "Figma", icon: null, website: null },
    ],
  };

  // Get skills for a category (either from API or fallback)
  const getSkillsForCategory = (categoryType: 'frontend' | 'backend' | 'tools') => {
    const apiFrameworks = frameworksByCategory[categoryType];
    
    if (apiFrameworks && apiFrameworks.length > 0) {
      return apiFrameworks.map(framework => ({
        name: framework.name,
        icon: framework.icon,
        color: framework.color,
        website: framework.website,
      }));
    }
    
    return fallbackSkills[categoryType] || [];
  };

  return (
    <ValorantBackground variant="minimal" className="py-20">
      <Section
        id="skills"
        title={t("skills.title")}
        subtitle={t("skills.subtitle")}
      >
        <Container>
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                {t("common.loading")}
              </p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">
                {t("common.error")}: {error.message}
              </p>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="grid md:grid-cols-3 gap-8">
              {skillCategories.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                const skills = getSkillsForCategory(category.type);
                
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
                      {skills.map((skill, skillIndex) => (
                        <div key={skillIndex}>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                            {skill.icon && (
                              <Image 
                                src={skill.icon} 
                                alt={skill.name}
                                width={16}
                                height={16}
                                className="w-4 h-4"
                                onError={(e) => {
                                  // Hide icon if it fails to load
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            {skill.website ? (
                              <a 
                                href={skill.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                {skill.name}
                              </a>
                            ) : (
                              skill.name
                            )}
                          </span>
                        </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </ValorantBackground>
  );
};
