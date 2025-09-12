"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card, Button } from "../ui";

export const Blog: React.FC = () => {
  const { t } = useLanguage();

  const articles = [
    {
      title: t("blog.items.reactBestPractices.title"),
      excerpt: t("blog.items.reactBestPractices.excerpt"),
      date: t("blog.items.reactBestPractices.date"),
      readTime: t("blog.items.reactBestPractices.readTime"),
      category: t("blog.items.reactBestPractices.category"),
      image: "⚛️",
      link: "#",
    },
    {
      title: t("blog.items.typescriptTips.title"),
      excerpt: t("blog.items.typescriptTips.excerpt"),
      date: t("blog.items.typescriptTips.date"),
      readTime: t("blog.items.typescriptTips.readTime"),
      category: t("blog.items.typescriptTips.category"),
      image: "📘",
      link: "#",
    },
    {
      title: t("blog.items.nextjsOptimization.title"),
      excerpt: t("blog.items.nextjsOptimization.excerpt"),
      date: t("blog.items.nextjsOptimization.date"),
      readTime: t("blog.items.nextjsOptimization.readTime"),
      category: t("blog.items.nextjsOptimization.category"),
      image: "🚀",
      link: "#",
    },
  ];

  return (
    <Section id="blog" title={t("blog.title")} subtitle={t("blog.subtitle")}>
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card key={index} hover className="flex flex-col">
              <div className="text-4xl mb-4 text-center">{article.image}</div>

              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {article.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {article.date}
                </span>
                <Button variant="ghost" size="sm">
                  {t("blog.readMore")}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {t("blog.viewAllArticles")}
          </Button>
        </div>
      </Container>
    </Section>
  );
};
