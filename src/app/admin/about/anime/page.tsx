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
import { AnimeForm, DeleteConfirmationModal } from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tv,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Hash,
} from "lucide-react";
import {
  useAnime,
  useCreateAnime,
  useUpdateAnime,
  useDeleteAnime,
  useToggleAnimeVisibility,
} from "@/hooks/about/useAnime";
import type { Anime, NewAnime, AnimeStatus } from "@/types";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "want_to_watch", label: "Want to Watch" },
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
  { value: "on_hold", label: "On Hold" },
];

export default function AnimeAdminPage() {
  const [filters, setFilters] = useState<{ search?: string; status?: AnimeStatus }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: anime = [], isLoading, error } = useAnime();
  const createAnime = useCreateAnime();
  const updateAnime = useUpdateAnime();
  const deleteAnime = useDeleteAnime();
  const toggleVisibility = useToggleAnimeVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create anime
  const handleCreateAnime = useCallback(async (animeData: any) => {
    try {
      await createAnime.mutateAsync(animeData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create anime:", error);
    }
  }, [createAnime]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateAnime(createFormData);
    }
  }, [createFormData, handleCreateAnime]);

  // Edit anime
  const handleEditAnime = (animeItem: Anime) => {
    setSelectedAnime(animeItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateAnime = useCallback(async (animeData: any) => {
    if (!selectedAnime) return;

    try {
      await updateAnime.mutateAsync({
        id: selectedAnime.id,
        anime: animeData,
      });
      setIsEditModalOpen(false);
      setSelectedAnime(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update anime:", error);
    }
  }, [selectedAnime, updateAnime]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedAnime) {
      handleUpdateAnime(editFormData);
    }
  }, [editFormData, selectedAnime, handleUpdateAnime]);

  // Delete anime
  const handleDelete = (animeItem: Anime) => {
    setSelectedAnime(animeItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAnime) return;

    try {
      await deleteAnime.mutateAsync(selectedAnime.id);
      setIsDeleteModalOpen(false);
      setSelectedAnime(null);
    } catch (error) {
      console.error("Failed to delete anime:", error);
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
              Anime
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your anime collection and watchlist
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
            title="Unable to Load Anime"
            description="There was an error loading the anime. Please try again later."
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
            Anime
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your anime collection and watchlist
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search anime..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value ? (e.target.value as AnimeStatus) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Status</option>
              {statusOptions.slice(1).map((option) => (
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
              Add Anime
            </Button>
          </form>
        </Card>

        {/* Anime Grid */}
        {anime.length === 0 ? (
          <EmptyState
            title="No Anime Found"
            description="No anime match your current filters. Try adjusting your search criteria or add a new anime."
            actionLabel="Add Anime"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {anime.map((animeItem) => (
              <Card key={animeItem.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        {animeItem.coverImage ? (
                          <Image
                            src={animeItem.coverImage}
                            alt={animeItem.title}
                            width={48}
                            height={48}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          <Tv className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {animeItem.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {animeItem.myAnimeListId && `MAL ID: ${animeItem.myAnimeListId}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAnime(animeItem)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(animeItem)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {animeItem.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                      {animeItem.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-1" />
                        {animeItem.status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                      {animeItem.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {animeItem.rating}/10
                        </div>
                      )}
                    </div>
                    {(animeItem.episodes || animeItem.currentEpisode) && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Tv className="w-4 h-4 mr-1" />
                        {animeItem.currentEpisode && animeItem.episodes 
                          ? `Episode ${animeItem.currentEpisode}/${animeItem.episodes}`
                          : animeItem.episodes 
                          ? `${animeItem.episodes} episodes`
                          : `Episode ${animeItem.currentEpisode}`
                        }
                      </div>
                    )}
                    {animeItem.genres && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="text-xs">Genres: {animeItem.genres}</span>
                      </div>
                    )}
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        animeItem.status === "completed"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : animeItem.status === "watching"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : animeItem.status === "want_to_watch"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {animeItem.status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {animeItem.visible ? (
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

        {/* Create Anime Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Anime"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createAnime.isPending}
          maxHeight="90vh"
        >
          <AnimeForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createAnime.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Anime Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAnime(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Anime"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedAnime(null);
            setEditFormData(null);
          }}
          isLoading={updateAnime.isPending}
          maxHeight="90vh"
        >
          {selectedAnime && (
            <AnimeForm
              anime={selectedAnime}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedAnime(null);
              }}
              isLoading={updateAnime.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedAnime(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Anime"
          message="Are you sure you want to delete this anime? This action cannot be undone."
          itemName={selectedAnime?.title}
          isLoading={deleteAnime.isPending}
        />
      </Container>
    </div>
  );
}
