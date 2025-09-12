"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card, EmptyState } from "../ui";
import { usePublicFeaturedBlogPosts } from "@/hooks/usePublicBlog";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Section id="blog" title={t("blog.title")} subtitle={t("blog.subtitle")}>
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              hover
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {post.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-full shadow-lg">
                    {post.category || "General"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {JSON.parse(post.tags)
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    {JSON.parse(post.tags).length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        +{JSON.parse(post.tags).length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {post.viewCount || 0}
                  </div>
                </div>

                {/* Reading Time */}
                {post.readingTime && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readingTime} min read
                  </div>
                )}

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </Card>
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
