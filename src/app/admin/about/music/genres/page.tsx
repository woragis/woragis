"use client";

import React, { useState, useCallback } from "react";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import {
  MusicGenresForm,
  DeleteConfirmationModal,
} from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Music,
  Eye,
  EyeOff,
  Calendar,
  Hash,
} from "lucide-react";
import {
  useMusicGenres,
  useCreateMusicGenre,
  useUpdateMusicGenre,
  useDeleteMusicGenre,
  useToggleMusicGenreVisibility,
} from "@/hooks/about/useMusic";
import type { MusicGenre, NewMusicGenre } from "@/types";

export default function MusicGenresAdminPage() {
  const [filters, setFilters] = useState<{ search?: string }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: genres = [], isLoading, error } = useMusicGenres();
  const createGenre = useCreateMusicGenre();
  const updateGenre = useUpdateMusicGenre();
  const deleteGenre = useDeleteMusicGenre();
  const toggleVisibility = useToggleMusicGenreVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create genre
  const handleCreateGenre = useCallback(async (genreData: any) => {
    try {
      await createGenre.mutateAsync(genreData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create genre:", error);
    }
  }, [createGenre]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateGenre(createFormData);
    }
  }, [createFormData, handleCreateGenre]);

  // Edit genre
  const handleEditGenre = (genreItem: MusicGenre) => {
    setSelectedGenre(genreItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateGenre = useCallback(async (genreData: any) => {
    if (!selectedGenre) return;

    try {
      await updateGenre.mutateAsync({
        id: selectedGenre.id,
        genre: genreData,
      });
      setIsEditModalOpen(false);
      setSelectedGenre(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update genre:", error);
    }
  }, [selectedGenre, updateGenre]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedGenre) {
      handleUpdateGenre(editFormData);
    }
  }, [editFormData, selectedGenre, handleUpdateGenre]);

  // Delete genre
  const handleDelete = (genreItem: MusicGenre) => {
    setSelectedGenre(genreItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGenre) return;

    try {
      await deleteGenre.mutateAsync(selectedGenre.id);
      setIsDeleteModalOpen(false);
      setSelectedGenre(null);
    } catch (error) {
      console.error("Failed to delete genre:", error);
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
              Music Genres
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your favorite music genres and preferences
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
            title="Unable to Load Music Genres"
            description="There was an error loading the music genres. Please try again later."
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
            Music Genres
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your favorite music genres and preferences
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search genres..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Genre
            </Button>
          </form>
        </Card>

        {/* Genres Grid */}
        {genres.length === 0 ? (
          <EmptyState
            title="No Music Genres Found"
            description="No music genres match your current filters. Try adjusting your search criteria or add a new genre."
            actionLabel="Add Genre"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {genres.map((genre) => (
              <Card key={genre.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        <Music className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {genre.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Music Genre
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditGenre(genre)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(genre)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {genre.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                      {genre.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {genre.order && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Hash className="w-4 h-4 mr-1" />
                        Order: {genre.order}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {genre.createdAt ? new Date(genre.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {genre.visible ? (
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

        {/* Create Genre Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Music Genre"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createGenre.isPending}
          maxHeight="90vh"
        >
          <MusicGenresForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createGenre.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Genre Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGenre(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Music Genre"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedGenre(null);
            setEditFormData(null);
          }}
          isLoading={updateGenre.isPending}
          maxHeight="90vh"
        >
          {selectedGenre && (
            <MusicGenresForm
              genre={selectedGenre}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedGenre(null);
              }}
              isLoading={updateGenre.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedGenre(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Music Genre"
          message="Are you sure you want to delete this music genre? This action cannot be undone."
          itemName={selectedGenre?.name}
          isLoading={deleteGenre.isPending}
        />
      </Container>
    </div>
  );
}
