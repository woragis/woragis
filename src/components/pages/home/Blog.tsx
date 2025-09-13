"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  EmptyState,
  Card,
  GamingBackground,
  Button,
} from "../../ui";
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
      <GamingBackground variant="neon" className="py-20">
        <Section
          id="blog"
          title={t("blog.title")}
          subtitle={t("blog.subtitle")}
        >
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} variant="gaming" className="animate-pulse">
                  <div className="p-6">
                    <div className="h-48 gaming-card rounded-lg mb-4"></div>
                    <div className="h-6 gaming-card rounded mb-3"></div>
                    <div className="h-4 gaming-card rounded mb-2"></div>
                    <div className="h-4 gaming-card rounded mb-2"></div>
                    <div className="h-4 gaming-card rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 gaming-card rounded w-24"></div>
                      <div className="h-4 gaming-card rounded w-16"></div>
                    </div>
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
      <GamingBackground variant="neon" className="py-20">
        <Section
          id="blog"
          title={t("blog.title")}
          subtitle={t("blog.subtitle")}
        >
          <Container>
            <EmptyState
              title="Unable to Load Blog Posts"
              description="There was an error loading the blog posts. Please try again later."
            />
          </Container>
        </Section>
      </GamingBackground>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <GamingBackground variant="neon" className="py-20">
        <Section
          id="blog"
          title={t("blog.title")}
          subtitle={t("blog.subtitle")}
        >
          <Container>
            <EmptyState
              title="No Blog Posts Yet"
              description="Blog posts will appear here once they are published."
            />
          </Container>
        </Section>
      </GamingBackground>
    );
  }

  return (
    <GamingBackground variant="neon" className="py-20">
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
              <Button
                variant="retro"
                size="lg"
                className="gaming-hover pixel-hover"
                onClick={() => (window.location.href = "/blog")}
              >
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Container>
      </Section>
    </GamingBackground>
  );
};
