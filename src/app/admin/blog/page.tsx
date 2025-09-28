"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/useBlog";
import {
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from "@/hooks/useBlog";
import { useBlogTags } from "@/hooks/useBlogTags";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { BlogForm } from "@/components/pages/admin/blog";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Globe,
  Calendar,
  Clock,
  Tag,
  X,
} from "lucide-react";
import type { BlogPost, BlogPostFilters, BlogPostFormData } from "@/types";
import type { BlogTag } from "@/types/blog-tags";

export default function BlogPage() {
  const [filters, setFilters] = useState<BlogPostFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: blogPosts = [], isLoading, error } = useBlogPosts(filters);
  const { data: availableTags = [] } = useBlogTags({ visible: true });
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create blog post
  const handleCreateBlogPost = useCallback(async (blogPostData: any) => {
    try {
      await createBlogPost.mutateAsync(blogPostData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create blog post:", error);
    }
  }, [createBlogPost]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateBlogPost(createFormData);
    }
  }, [createFormData]);

  // Edit blog post
  const handleEditBlogPost = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsEditModalOpen(true);
  };

  const handleUpdateBlogPost = useCallback(async (blogPostData: any) => {
    if (!selectedBlogPost) return;

    try {
      await updateBlogPost.mutateAsync({
        id: selectedBlogPost.id,
        blogPost: blogPostData,
      });
      setIsEditModalOpen(false);
      setSelectedBlogPost(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update blog post:", error);
    }
  }, [selectedBlogPost, updateBlogPost]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedBlogPost) {
      handleUpdateBlogPost(editFormData);
    }
  }, [editFormData, selectedBlogPost]);

  const handleDelete = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlogPost) return;

    try {
      await deleteBlogPost.mutateAsync(selectedBlogPost.id);
      setIsDeleteModalOpen(false);
      setSelectedBlogPost(null);
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Blog Posts
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your blog posts and articles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Posts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your blog posts and articles
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open("/admin/blog/tags", "_blank")}
              className="flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Manage Tags
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.published?.toString() || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  published: e.target.value
                    ? e.target.value === "true"
                    : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Posts</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
            <select
              value={filters.featured?.toString() || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  featured: e.target.value
                    ? e.target.value === "true"
                    : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Posts</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
            <select
              value={filters.visible?.toString() || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  visible: e.target.value
                    ? e.target.value === "true"
                    : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Visibility</option>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </form>
        </Card>

        {/* Blog Posts Grid */}
        {blogPosts.length === 0 ? (
          <EmptyState
            title="No Blog Posts Found"
            description="No blog posts match your current filters. Try adjusting your search criteria or add a new blog post."
            actionLabel="Add Blog Post"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
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
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {post.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBlogPost(post)}
                      className="bg-white dark:bg-gray-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post)}
                      className="bg-white dark:bg-gray-800 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(
                          post.publishedAt || post.createdAt || new Date()
                        )}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.viewCount || 0}
                      </div>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readingTime} min read
                      </div>
                    )}
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {post.featured && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                    {post.published ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                    {post.visible ? (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        Visible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                        Hidden
                      </span>
                    )}
                    {post.public && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                        Public
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Blog Post Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateFormData(null);
        }}
          isEdit={false}
          itemName="Blog Post"
          size="xl"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createBlogPost.isPending}
          maxHeight="95vh"
        >
          <BlogForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createBlogPost.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Blog Post Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBlogPost(null);
          setEditFormData(null);
        }}
          isEdit={true}
          itemName="Blog Post"
          size="xl"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedBlogPost(null);
            setEditFormData(null);
          }}
          isLoading={updateBlogPost.isPending}
          maxHeight="95vh"
        >
          {selectedBlogPost && (
            <BlogForm
              blogPost={selectedBlogPost}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedBlogPost(null);
              }}
              isLoading={updateBlogPost.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedBlogPost(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Blog Post"
          message="Are you sure you want to delete this blog post? This action cannot be undone."
          itemName={selectedBlogPost?.title}
          isLoading={deleteBlogPost.isPending}
        />
      </Container>
    </div>
  );
}
