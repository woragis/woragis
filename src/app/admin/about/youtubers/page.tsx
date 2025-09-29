"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import {
  YouTubersForm,
  DeleteConfirmationModal,
} from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Play,
  Eye,
  EyeOff,
  Calendar,
  Hash,
  Users,
} from "lucide-react";
import {
  useYoutubers,
  useCreateYoutuber,
  useUpdateYoutuber,
  useDeleteYoutuber,
  useToggleYoutuberVisibility,
} from "@/hooks/about/useYoutubers";
import type { Youtuber, NewYoutuber, YoutuberCategory } from "@/types";

const categoryOptions = [
  { value: "all", label: "All" },
  { value: "current", label: "Current" },
  { value: "childhood", label: "Childhood" },
];

export default function YouTubersAdminPage() {
  const [filters, setFilters] = useState<{ search?: string; category?: YoutuberCategory | "all" }>({ category: "all" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedYouTuber, setSelectedYouTuber] = useState<Youtuber | null>(
    null
  );
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: youTubers = [], isLoading, error } = useYoutubers();
  const createYouTuber = useCreateYoutuber();
  const updateYouTuber = useUpdateYoutuber();
  const deleteYouTuber = useDeleteYoutuber();
  const toggleVisibility = useToggleYoutuberVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create YouTuber
  const handleCreateYouTuber = useCallback(async (youTuberData: any) => {
    try {
      await createYouTuber.mutateAsync(youTuberData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create YouTuber:", error);
    }
  }, [createYouTuber]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateYouTuber(createFormData);
    }
  }, [createFormData, handleCreateYouTuber]);

  // Edit YouTuber
  const handleEditYouTuber = (youTuberItem: Youtuber) => {
    setSelectedYouTuber(youTuberItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateYouTuber = useCallback(async (youTuberData: any) => {
    if (!selectedYouTuber) return;

    try {
      await updateYouTuber.mutateAsync({
        id: selectedYouTuber.id,
        youtuber: youTuberData,
      });
      setIsEditModalOpen(false);
      setSelectedYouTuber(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update YouTuber:", error);
    }
  }, [selectedYouTuber, updateYouTuber]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedYouTuber) {
      handleUpdateYouTuber(editFormData);
    }
  }, [editFormData, selectedYouTuber, handleUpdateYouTuber]);

  // Delete YouTuber
  const handleDelete = (youTuberItem: Youtuber) => {
    setSelectedYouTuber(youTuberItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedYouTuber) return;

    try {
      await deleteYouTuber.mutateAsync(selectedYouTuber.id);
      setIsDeleteModalOpen(false);
      setSelectedYouTuber(null);
    } catch (error) {
      console.error("Failed to delete YouTuber:", error);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              YouTubers
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage YouTubers you watch currently and from childhood
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
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
            title="Unable to Load YouTubers"
            description="There was an error loading the YouTubers. Please try again later."
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
            YouTubers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage YouTubers you watch currently and from childhood
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search YouTubers..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.category || "all"}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value as YoutuberCategory | "all" })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add YouTuber
            </Button>
          </form>
        </Card>

        {/* YouTubers Grid */}
        {youTubers.length === 0 ? (
          <EmptyState
            title="No YouTubers Found"
            description="No YouTubers match your current filters. Try adjusting your search criteria or add a new YouTuber."
            actionLabel="Add YouTuber"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youTubers.map((youTuber) => (
              <Card key={youTuber.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      {youTuber.profileImage ? (
                        <Image
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                          src={youTuber.profileImage}
                          alt={youTuber.channelName}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                          <Play className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {youTuber.channelName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          YouTuber
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditYouTuber(youTuber)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(youTuber)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {youTuber.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                      {youTuber.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {youTuber.category && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Hash className="w-4 h-4 mr-1" />
                        Category: {youTuber.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    )}
                    {youTuber.contentType && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Hash className="w-4 h-4 mr-1" />
                        Content: {youTuber.contentType}
                      </div>
                    )}
                    {youTuber.subscriberCount && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        {youTuber.subscriberCount} subscribers
                      </div>
                    )}
                    {youTuber.youtubeUrl && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Play className="w-4 h-4 mr-1" />
                        YouTube Available
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {new Date(youTuber.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {youTuber.visible ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Visible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create YouTuber Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="YouTuber"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createYouTuber.isPending}
          maxHeight="90vh"
        >
          <YouTubersForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createYouTuber.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit YouTuber Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedYouTuber(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="YouTuber"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedYouTuber(null);
            setEditFormData(null);
          }}
          isLoading={updateYouTuber.isPending}
          maxHeight="90vh"
        >
          {selectedYouTuber && (
            <YouTubersForm
              youTuber={selectedYouTuber}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedYouTuber(null);
              }}
              isLoading={updateYouTuber.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedYouTuber(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete YouTuber"
          message="Are you sure you want to delete this YouTuber? This action cannot be undone."
          itemName={selectedYouTuber?.channelName}
          isLoading={deleteYouTuber.isPending}
        />
      </Container>
    </div>
  );
}
