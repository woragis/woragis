"use client";

import React, { useState } from "react";
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
  Modal,
} from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(
    null
  );
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    readingTime: 0,
    featured: false,
    published: false,
    publishedAt: undefined,
    order: 0,
    visible: true,
    public: true,
  });
  const [selectedTags, setSelectedTags] = useState<BlogTag[]>([]);

  const { data: blogPosts = [], isLoading, error } = useBlogPosts(filters);
  const { data: availableTags = [] } = useBlogTags({ visible: true });
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  const handleCreate = () => {
    setEditingBlogPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      readingTime: 0,
      featured: false,
      published: false,
      publishedAt: undefined,
      order: 0,
      visible: true,
      public: true,
    });
    setSelectedTags([]);
    setIsFormOpen(true);
  };

  const handleEdit = (blogPost: BlogPost) => {
    setEditingBlogPost(blogPost);
    setFormData({
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage || "",
      readingTime: blogPost.readingTime || 0,
      featured: blogPost.featured || false,
      published: blogPost.published || false,
      publishedAt: blogPost.publishedAt
        ? new Date(blogPost.publishedAt)
        : undefined,
      order: blogPost.order,
      visible: blogPost.visible || true,
      public: blogPost.public || true,
    });
    // TODO: Load existing tags for this blog post
    setSelectedTags([]);
    setIsFormOpen(true);
  };

  const handleAddTag = (tag: BlogTag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        publishedAt: formData.publishedAt || null,
      };

      if (editingBlogPost) {
        await updateBlogPost.mutateAsync({
          id: editingBlogPost.id,
          blogPost: submitData,
        });
      } else {
        await createBlogPost.mutateAsync(submitData);
      }
      setIsFormOpen(false);
      setEditingBlogPost(null);
    } catch (error) {
      console.error("Error saving blog post:", error);
    }
  };

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
            <Button onClick={handleCreate}>
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
            onAction={handleCreate}
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
                    <img
                      src={post.featuredImage}
                      alt={post.title}
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
                      onClick={() => handleEdit(post)}
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

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {editingBlogPost ? "Edit Blog Post" : "Add New Blog Post"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value });
                          // Auto-generate slug from title
                          if (!editingBlogPost) {
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9 -]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/-+/g, "-")
                              .trim();
                            setFormData((prev) => ({ ...prev, slug }));
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content *
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuredImage: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Tags Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: tag.color || "#3B82F6" }}
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag.id)}
                              className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Available Tags */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available tags:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableTags
                          .filter(
                            (tag: BlogTag) =>
                              !selectedTags.find((t) => t.id === tag.id)
                          )
                          .map((tag: BlogTag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => handleAddTag(tag)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: tag.color || "#3B82F6",
                                }}
                              />
                              {tag.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reading Time (minutes)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.readingTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            readingTime: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Featured
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            published: e.target.checked,
                            publishedAt: e.target.checked
                              ? new Date()
                              : undefined,
                          })
                        }
                        className="mr-2"
                      />
                      Published
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            visible: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Visible
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.public}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            public: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Public
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingBlogPost
                        ? "Update Blog Post"
                        : "Create Blog Post"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

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
