"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Calendar, Clock, Eye, ArrowRight, Tag } from "lucide-react";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  showTags?: boolean;
  showMeta?: boolean;
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  showExcerpt = true,
  showTags = true,
  showMeta = true,
  className = "",
}) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const tags = post.tags ? JSON.parse(post.tags) : [];

  return (
    <Card hover className={`flex flex-col h-full overflow-hidden ${className}`}>
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
        {showExcerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {showTags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        {showMeta && (
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
        )}

        {/* Reading Time */}
        {post.readingTime && showMeta && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            {post.readingTime} min read
          </div>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors mt-auto"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </Card>
  );
};

