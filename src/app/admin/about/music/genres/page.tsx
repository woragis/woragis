"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import {
  MusicGenresForm,
  DeleteConfirmationModal,
} from "@/components/pages/admin";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  useMusicGenres,
  useCreateMusicGenre,
  useUpdateMusicGenre,
  useDeleteMusicGenre,
  useToggleMusicGenreVisibility,
} from "@/hooks/about/useMusic";
import type { MusicGenre, NewMusicGenre } from "@/types";

export default function MusicGenresAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks
  const { data: genres, isLoading, error } = useMusicGenres();
  const createGenre = useCreateMusicGenre();
  const updateGenre = useUpdateMusicGenre();
  const deleteGenre = useDeleteMusicGenre();
  const toggleVisibility = useToggleMusicGenreVisibility();

  const searchedGenres =
    genres?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create genre
  const handleCreateGenre = async (genreData: NewMusicGenre) => {
    try {
      await createGenre.mutateAsync(genreData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create genre:", error);
    }
  };

  // Edit genre
  const handleEditGenre = (genreItem: MusicGenre) => {
    setSelectedGenre(genreItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateGenre = async (genreData: NewMusicGenre) => {
    if (!selectedGenre) return;

    try {
      await updateGenre.mutateAsync({
        id: selectedGenre.id,
        genre: genreData,
      });
      setIsEditModalOpen(false);
      setSelectedGenre(null);
    } catch (error) {
      console.error("Failed to update genre:", error);
    }
  };

  // Delete genre
  const handleDeleteGenre = (genreItem: MusicGenre) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading music genres</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Genre
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Music Genres"
        description="Manage your favorite music genres and preferences"
        headerActions={headerActions}
      >
        {/* Search */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search genres..."
          selectedFilter=""
          onFilterChange={() => {}}
        />

        {/* Genres List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedGenres?.map((genreItem) => (
              <li key={genreItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {genreItem.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {genreItem.name}
                        </h3>
                        {!genreItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {genreItem.description}
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Order: {genreItem.order || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(genreItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        genreItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {genreItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditGenre(genreItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGenre(genreItem)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </AdminPageLayout>

      {/* Create Genre Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Genre"
        size="lg"
      >
        <MusicGenresForm
          onSubmit={handleCreateGenre}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createGenre.isPending}
        />
      </Modal>

      {/* Edit Genre Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGenre(null);
        }}
        title="Edit Genre"
        size="lg"
      >
        {selectedGenre && (
          <MusicGenresForm
            genre={selectedGenre}
            onSubmit={handleUpdateGenre}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedGenre(null);
            }}
            isLoading={updateGenre.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedGenre(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Genre"
        message="Are you sure you want to delete this music genre? This action cannot be undone."
        itemName={selectedGenre?.name}
        isLoading={deleteGenre.isPending}
      />
    </>
  );
}
