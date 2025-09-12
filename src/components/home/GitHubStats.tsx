"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card } from "../ui";

export const GitHubStats: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      label: t("githubStats.commits"),
      value: "2,847",
      icon: "📊",
    },
    {
      label: t("githubStats.repositories"),
      value: "24",
      icon: "📁",
    },
    {
      label: t("githubStats.stars"),
      value: "156",
      icon: "⭐",
    },
    {
      label: t("githubStats.contributions"),
      value: "1,234",
      icon: "🔥",
    },
  ];

  const languages = [
    { name: "TypeScript", percentage: 35, color: "bg-blue-500" },
    { name: "JavaScript", percentage: 28, color: "bg-yellow-500" },
    { name: "Python", percentage: 20, color: "bg-green-500" },
    { name: "Go", percentage: 12, color: "bg-cyan-500" },
    { name: "Other", percentage: 5, color: "bg-gray-500" },
  ];

  const recentRepos = [
    {
      name: "awesome-portfolio",
      description: t("githubStats.repos.portfolio.description"),
      language: "TypeScript",
      stars: 42,
      forks: 8,
      updated: "2 days ago",
    },
    {
      name: "react-component-library",
      description: t("githubStats.repos.componentLibrary.description"),
      language: "TypeScript",
      stars: 28,
      forks: 5,
      updated: "1 week ago",
    },
    {
      name: "nodejs-api-boilerplate",
      description: t("githubStats.repos.apiBoilerplate.description"),
      language: "JavaScript",
      stars: 15,
      forks: 3,
      updated: "2 weeks ago",
    },
  ];

  return (
    <Section
      id="github-stats"
      title={t("githubStats.title")}
      subtitle={t("githubStats.subtitle")}
    >
      <Container>
        <div className="space-y-12">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} hover className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Language Distribution */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t("githubStats.languageDistribution")}
              </h3>
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {lang.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {lang.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`${lang.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Repositories */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t("githubStats.recentRepositories")}
              </h3>
              <div className="space-y-4">
                {recentRepos.map((repo, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        {repo.name}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {repo.updated}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {repo.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        {repo.language}
                      </span>
                      <span className="flex items-center">⭐ {repo.stars}</span>
                      <span className="flex items-center">🍴 {repo.forks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* GitHub Contribution Graph Placeholder */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t("githubStats.contributionGraph")}
            </h3>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                📈 {t("githubStats.graphPlaceholder")}
              </div>
              <div className="grid grid-cols-52 gap-1 max-w-4xl mx-auto">
                {Array.from({ length: 365 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      Math.random() > 0.7
                        ? "bg-green-500"
                        : Math.random() > 0.4
                        ? "bg-green-400"
                        : Math.random() > 0.2
                        ? "bg-green-300"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {t("githubStats.graphDescription")}
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};
