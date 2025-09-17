"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import { AnimeForm, DeleteConfirmationModal } from "@/components/pages/admin";
import { ActionButton } from "@/components/ui/ActionButton";
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AnimeStatus | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks
  const { data: anime, isLoading, error } = useAnime();
  const createAnime = useCreateAnime();
  const updateAnime = useUpdateAnime();
  const deleteAnime = useDeleteAnime();
  const toggleVisibility = useToggleAnimeVisibility();

  const filteredAnime =
    selectedStatus === "all"
      ? anime
      : anime?.filter((item) => item.status === selectedStatus) || [];

  const searchedAnime =
    filteredAnime?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create anime
  const handleCreateAnime = async (animeData: NewAnime) => {
    try {
      await createAnime.mutateAsync(animeData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create anime:", error);
    }
  };

  // Edit anime
  const handleEditAnime = (animeItem: Anime) => {
    setSelectedAnime(animeItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateAnime = async (animeData: NewAnime) => {
    if (!selectedAnime) return;

    try {
      await updateAnime.mutateAsync({
        id: selectedAnime.id,
        anime: animeData,
      });
      setIsEditModalOpen(false);
      setSelectedAnime(null);
    } catch (error) {
      console.error("Failed to update anime:", error);
    }
  };

  // Delete anime
  const handleDeleteAnime = (animeItem: Anime) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading anime</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Anime
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Anime List"
        description="Manage your anime collection"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search anime..."
          filterOptions={statusOptions}
          selectedFilter={selectedStatus}
          onFilterChange={(value) =>
            setSelectedStatus(value as AnimeStatus | "all")
          }
        />

        {/* Anime List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedAnime?.map((animeItem) => (
              <li key={animeItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-lg object-cover"
                        src={animeItem.coverImage || "/api/placeholder/40/40"}
                        alt={animeItem.title}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {animeItem.title}
                        </h3>
                        {!animeItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {animeItem.description}
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Status:{" "}
                          {animeItem.status
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          {animeItem.episodes &&
                            ` • Episodes: ${animeItem.episodes}`}
                          {animeItem.currentEpisode &&
                            ` • Current: ${animeItem.currentEpisode}`}
                          {animeItem.rating &&
                            ` • Rating: ${animeItem.rating}/10`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(animeItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        animeItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {animeItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditAnime(animeItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAnime(animeItem)}
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

      {/* Create Anime Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Anime"
        size="lg"
      >
        <AnimeForm
          onSubmit={handleCreateAnime}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createAnime.isPending}
        />
      </Modal>

      {/* Edit Anime Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAnime(null);
        }}
        title="Edit Anime"
        size="lg"
      >
        {selectedAnime && (
          <AnimeForm
            anime={selectedAnime}
            onSubmit={handleUpdateAnime}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedAnime(null);
            }}
            isLoading={updateAnime.isPending}
          />
        )}
      </Modal>

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
    </>
  );
}
