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
import { GamesForm, DeleteConfirmationModal } from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Gamepad2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Hash,
} from "lucide-react";
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
  const [filters, setFilters] = useState<{ search?: string; category?: GameCategory }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: games = [], isLoading, error } = useGames();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();
  const toggleVisibility = useToggleGameVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create game
  const handleCreateGame = useCallback(async (gameData: any) => {
    try {
      await createGame.mutateAsync(gameData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create game:", error);
    }
  }, [createGame]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateGame(createFormData);
    }
  }, [createFormData, handleCreateGame]);

  // Edit game
  const handleEditGame = (gameItem: Game) => {
    setSelectedGame(gameItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateGame = useCallback(async (gameData: any) => {
    if (!selectedGame) return;

    try {
      await updateGame.mutateAsync({
        id: selectedGame.id,
        game: gameData,
      });
      setIsEditModalOpen(false);
      setSelectedGame(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update game:", error);
    }
  }, [selectedGame, updateGame]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedGame) {
      handleUpdateGame(editFormData);
    }
  }, [editFormData, selectedGame, handleUpdateGame]);

  // Delete game
  const handleDelete = (gameItem: Game) => {
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

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Games
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your gaming preferences and favorites
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
            title="Unable to Load Games"
            description="There was an error loading the games. Please try again later."
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
            Games
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your gaming preferences and favorites
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search games..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value ? (e.target.value as GameCategory) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              {categoryOptions.slice(1).map((option) => (
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
              Add Game
            </Button>
          </form>
        </Card>

        {/* Games Grid */}
        {games.length === 0 ? (
          <EmptyState
            title="No Games Found"
            description="No games match your current filters. Try adjusting your search criteria or add a new game."
            actionLabel="Add Game"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <Card key={game.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        {game.coverImage ? (
                          <Image
                            src={game.coverImage}
                            alt={game.title}
                            width={48}
                            height={48}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          <Gamepad2 className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {game.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {game.platform}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditGame(game)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(game)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {game.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                      {game.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-1" />
                        {game.category?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                      {game.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {game.rating}/10
                        </div>
                      )}
                    </div>
                    {game.genre && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="text-xs">Genre: {game.genre}</span>
                      </div>
                    )}
                    {game.playtime && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="text-xs">Playtime: {game.playtime}h</span>
                      </div>
                    )}
                    {game.steamUrl && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="text-xs">Steam Available</span>
                      </div>
                    )}
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        game.category === "current"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : game.category === "childhood"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : game.category === "planned"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {game.category?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {game.visible ? (
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

        {/* Create Game Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Game"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createGame.isPending}
          maxHeight="90vh"
        >
          <GamesForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createGame.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Game Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGame(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Game"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedGame(null);
            setEditFormData(null);
          }}
          isLoading={updateGame.isPending}
          maxHeight="90vh"
        >
          {selectedGame && (
            <GamesForm
              game={selectedGame}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedGame(null);
              }}
              isLoading={updateGame.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

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
      </Container>
    </div>
  );
}
