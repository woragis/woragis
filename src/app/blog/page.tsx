"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicBlogPosts } from "@/hooks/usePublicBlog";
import {
  Section,
  Container,
  Card,
  EmptyState,
  Button,
  Breadcrumb,
} from "@/components/ui";
import { BlogCard, BlogFilters, BlogPagination } from "@/components/pages/blog";
import Link from "next/link";
import type { BlogPost } from "@/types";

export default function BlogPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );

  const { data: allPosts = [], isLoading, error } = usePublicBlogPosts();

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    const filtered = allPosts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt || b.createdAt || new Date()).getTime() -
            new Date(a.publishedAt || a.createdAt || new Date()).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt || a.createdAt || new Date()).getTime() -
            new Date(b.publishedAt || b.createdAt || new Date()).getTime()
          );
        case "popular":
          return (b.viewCount || 0) - (a.viewCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allPosts, searchTerm, sortBy]);

  // Pagination
  const postsPerPage = 9;
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredAndSortedPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("blog.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t("blog.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <EmptyState
            title="Unable to Load Blog Posts"
            description="There was an error loading the blog posts. Please try again later."
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Blog" }]} className="mb-8" />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("blog.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("blog.subtitle")}
          </p>
        </div>

        {/* Search and Filters */}
        <BlogFilters
          searchTerm={searchTerm}
          onSearchChange={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={(sort) => {
            setSortBy(sort);
            setCurrentPage(1);
          }}
          onClearFilters={clearFilters}
          hasActiveFilters={!!searchTerm}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredAndSortedPosts.length} article
            {filteredAndSortedPosts.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {paginatedPosts.length === 0 ? (
          <EmptyState
            title="No Articles Found"
            description="No articles match your current filters. Try adjusting your search criteria."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Container>
    </div>
  );
}
