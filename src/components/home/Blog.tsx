"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, EmptyState, Card } from "../ui";
import { BlogCard } from "../blog";
import { usePublicFeaturedBlogPosts } from "@/hooks/usePublicBlog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Blog: React.FC = () => {
  const { t } = useLanguage();
  const {
    data: blogPosts = [],
    isLoading,
    error,
  } = usePublicFeaturedBlogPosts(3);

  if (isLoading) {
    return (
      <Section id="blog" title={t("blog.title")} subtitle={t("blog.subtitle")}>
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="blog" title={t("blog.title")} subtitle={t("blog.subtitle")}>
        <Container>
          <EmptyState
            title="Unable to Load Blog Posts"
            description="There was an error loading the blog posts. Please try again later."
          />
        </Container>
      </Section>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <Section id="blog" title={t("blog.title")} subtitle={t("blog.subtitle")}>
        <Container>
          <EmptyState
            title="No Blog Posts Yet"
            description="Blog posts will appear here once they are published."
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section id="blog" title={t("blog.title")} subtitle={t("blog.subtitle")}>
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Posts Link */}
        {blogPosts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
};
