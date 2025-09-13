"use client";

import React from "react";
import { Calendar, Clock, Eye, Heart, Tag, User } from "lucide-react";
import type { BlogPost } from "@/types";

interface BlogMetaProps {
  post: BlogPost;
  showAuthor?: boolean;
  showTags?: boolean;
  showReadingTime?: boolean;
  showViewCount?: boolean;
  showLikeCount?: boolean;
  className?: string;
}

export const BlogMeta: React.FC<BlogMetaProps> = ({
  post,
  showAuthor = false,
  showTags = true,
  showReadingTime = true,
  showViewCount = true,
  showLikeCount = false,
  className = "",
}) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tags = post.tags ? JSON.parse(post.tags) : [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>

        {showReadingTime && post.readingTime && (
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{post.readingTime} min read</span>
          </div>
        )}

        {showViewCount && (
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            <span>{post.viewCount || 0} views</span>
          </div>
        )}

        {showLikeCount && (
          <div className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            <span>{post.likeCount || 0} likes</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {showTags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      {showAuthor && (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Author Name
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Full-stack developer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

