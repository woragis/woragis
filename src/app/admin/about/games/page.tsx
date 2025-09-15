"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import { GamesForm, DeleteConfirmationModal } from "@/components/pages/admin";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  useGames,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
  useToggleGameVisibility,
} from "@/hooks/about/useGames";
import type { Game, NewGame, GameCategory } from "@/types";

const categoryOptions = [
  { value: "all", label: "All" },
  { value: "childhood", label: "Childhood" },
  { value: "current", label: "Current" },
  { value: "planned", label: "Planned" },
];

export default function GamesAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    GameCategory | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks
  const { data: games, isLoading, error } = useGames();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();
  const toggleVisibility = useToggleGameVisibility();

  const filteredGames =
    selectedCategory === "all"
      ? games
      : games?.filter((item) => item.category === selectedCategory) || [];

  const searchedGames =
    filteredGames?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create game
  const handleCreateGame = async (gameData: NewGame) => {
    try {
      await createGame.mutateAsync(gameData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create game:", error);
    }
  };

  // Edit game
  const handleEditGame = (gameItem: Game) => {
    setSelectedGame(gameItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateGame = async (gameData: NewGame) => {
    if (!selectedGame) return;

    try {
      await updateGame.mutateAsync({
        id: selectedGame.id,
        game: gameData,
      });
      setIsEditModalOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error("Failed to update game:", error);
    }
  };

  // Delete game
  const handleDeleteGame = (gameItem: Game) => {
    setSelectedGame(gameItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGame) return;

    try {
      await deleteGame.mutateAsync(selectedGame.id);
      setIsDeleteModalOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading games</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Game
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Games List"
        description="Manage your game collection"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search games..."
          filterOptions={categoryOptions}
          selectedFilter={selectedCategory}
          onFilterChange={(value) =>
            setSelectedCategory(value as GameCategory | "all")
          }
        />

        {/* Games List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedGames?.map((gameItem) => (
              <li key={gameItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={gameItem.coverImage}
                        alt={gameItem.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {gameItem.title}
                        </h3>
                        {!gameItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {gameItem.platform}
                        {gameItem.genre && ` - ${gameItem.genre}`}
                        {gameItem.description && ` - ${gameItem.description}`}
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Category:{" "}
                          {gameItem.category
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          {gameItem.playtime &&
                            ` • Playtime: ${gameItem.playtime}h`}
                          {gameItem.rating &&
                            ` • Rating: ${gameItem.rating}/10`}
                          {gameItem.steamUrl && ` • Steam Available`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(gameItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        gameItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {gameItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditGame(gameItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGame(gameItem)}
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

      {/* Create Game Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Game"
        size="lg"
      >
        <GamesForm
          onSubmit={handleCreateGame}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createGame.isPending}
        />
      </Modal>

      {/* Edit Game Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGame(null);
        }}
        title="Edit Game"
        size="lg"
      >
        {selectedGame && (
          <GamesForm
            game={selectedGame}
            onSubmit={handleUpdateGame}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedGame(null);
            }}
            isLoading={updateGame.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedGame(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Game"
        message="Are you sure you want to delete this game? This action cannot be undone."
        itemName={selectedGame?.title}
        isLoading={deleteGame.isPending}
      />
    </>
  );
}
