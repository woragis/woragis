"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicBlogPost } from "@/hooks/usePublicBlog";
import {
  Container,
  Card,
  EmptyState,
  Button,
  Breadcrumb,
} from "@/components/ui";
import { BlogMeta, BlogShare } from "@/components/pages/blog";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePublicBlogPost(slug, true); // Increment views on load

  // Handle not found
  if (!isLoading && !post) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="mb-8">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="flex space-x-4 mb-8">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <EmptyState
            title="Unable to Load Article"
            description="There was an error loading this article. Please try again later."
            actionLabel="Back to Blog"
            onAction={() => router.push("/blog")}
          />
        </Container>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <EmptyState
            title="Article Not Found"
            description="The article you're looking for doesn't exist or has been removed."
            actionLabel="Back to Blog"
            onAction={() => router.push("/blog")}
          />
        </Container>
      </div>
    );
  }

  const tags = post.tags ? JSON.parse(post.tags) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: post?.title || "Loading..." },
            ]}
            className="mb-8"
          />

          {/* Article Header */}
          <Card className="p-8 mb-8">
            {/* Category */}
            {post.category && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                  {post.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <BlogMeta
              post={post}
              showReadingTime={true}
              showViewCount={true}
              showLikeCount={true}
              showTags={true}
              className="mb-8"
            />

            {/* Share Buttons */}
            <BlogShare
              url={typeof window !== "undefined" ? window.location.href : ""}
              title={post.title}
              className="pt-6 border-t border-gray-200 dark:border-gray-700"
            />
          </Card>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <Card className="p-8">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card>

          {/* Author Info */}
          <Card className="p-6 mt-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Author Name
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Full-stack developer passionate about creating amazing digital
                  experiences.
                </p>
              </div>
            </div>
          </Card>

          {/* Related Articles or Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
