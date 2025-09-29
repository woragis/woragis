"use client";

import React, { useState } from "react";
import {
  useBlogTags,
  useCreateBlogTag,
  useUpdateBlogTag,
  useDeleteBlogTag,
} from "@/hooks/useBlogTags";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
  Modal,
} from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Tag } from "lucide-react";
import type {
  BlogTag,
  BlogTagFilters,
  BlogTagFormData,
} from "@/types/blog-tags";

export default function BlogTagsPage() {
  const [filters, setFilters] = useState<BlogTagFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<BlogTag | null>(null);
  const [formData, setFormData] = useState<BlogTagFormData>({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    visible: true,
    order: 0,
  });

  const { data: tags = [], isLoading, error } = useBlogTags(filters);
  const createTag = useCreateBlogTag();
  const updateTag = useUpdateBlogTag();
  const deleteTag = useDeleteBlogTag();

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm });
  };

  const handleCreate = () => {
    setEditingTag(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      visible: true,
      order: 0,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || "",
      color: tag.color || "#3B82F6",
      visible: tag.visible ?? true,
      order: tag.order,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTag) {
        await updateTag.mutateAsync({
          id: editingTag.id,
          data: formData,
        });
      } else {
        await createTag.mutateAsync(formData as any);
      }
      setIsFormOpen(false);
      setEditingTag(null);
    } catch (error) {
      console.error("Error saving blog tag:", error);
    }
  };

  const handleDelete = (tag: BlogTag) => {
    setSelectedTag(tag);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTag) {
      try {
        await deleteTag.mutateAsync(selectedTag.id);
        setIsDeleteModalOpen(false);
        setSelectedTag(null);
      } catch (error) {
        console.error("Error deleting blog tag:", error);
      }
    }
  };

  const toggleVisibility = async (tag: BlogTag) => {
    try {
      await updateTag.mutateAsync({
        id: tag.id,
        data: { visible: !tag.visible },
      });
    } catch (error) {
      console.error("Error updating blog tag visibility:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Blog Tags
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage blog tags and categories
            </p>
          </div>

          {/* Search and Filter Skeleton */}
          <Card className="p-6 mb-8 animate-pulse">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </Card>

          {/* Tags Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-24"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">
              Error loading blog tags: {error.message}
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        <Section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Blog Tags
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage tags for your blog posts
              </p>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Tag
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tags..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Tags Grid */}
          {tags.length === 0 ? (
            <EmptyState
              icon={Tag}
              title="No tags found"
              description="Create your first blog tag to get started"
              onAction={handleCreate}
              actionLabel="Add Tag"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tags.map((tag) => (
                <Card key={tag.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color || "#3B82F6" }}
                      />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tag.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleVisibility(tag)}
                        className={
                          tag.visible ? "text-green-600" : "text-gray-400"
                        }
                      >
                        {tag.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tag)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(tag)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {tag.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {tag.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>Slug: {tag.slug}</p>
                    <p>Order: {tag.order}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingTag ? "Edit Blog Tag" : "Create Blog Tag"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) =>
                    setFormData({ ...formData, visible: e.target.checked })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="visible"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Visible
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTag ? "Update" : "Create"} Tag
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Blog Tag"
          message={`Are you sure you want to delete the tag "${selectedTag?.name}"? This action cannot be undone.`}
        />
      </Container>
    </div>
  );
}
