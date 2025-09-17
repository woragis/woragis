"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  showMeta?: boolean;
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  showExcerpt = true,
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

  return (
    <Card
      hover
      className={`flex flex-col h-full overflow-hidden animate-fade-in-up ${className}`}
    >
      {/* Featured Image */}
      <div className="relative h-48 overflow-hidden group">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-700">
            <span className="text-white text-4xl font-bold transition-transform duration-300 group-hover:scale-110">
              {post.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {post.title}
        </h3>

        {/* Excerpt */}
        {showExcerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3 transition-colors duration-200">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full transition-all duration-200 hover:scale-105 animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-all duration-200 hover:scale-105">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        {showMeta && (
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
              {formatDate(post.publishedAt || post.createdAt)}
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
              {post.viewCount || 0}
            </div>
          </div>
        )}

        {/* Reading Time */}
        {post.readingTime && showMeta && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
            <Clock className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
            {post.readingTime} min read
          </div>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-all duration-200 mt-auto hover:scale-105 group-hover:translate-x-1"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
};
