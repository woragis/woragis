"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
  AdminList,
  AdminGrid,
  DisplayToggle,
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
import type { AdminListItem } from "@/components/ui/admin/AdminList";
import type { AdminGridItem } from "@/components/ui/admin/AdminGrid";
import { useDisplay } from "@/contexts/DisplayContext";

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
  const { displayMode } = useDisplay();
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
            <DisplayToggle />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </form>
        </Card>

        {/* Games Display */}
        {games.length === 0 ? (
          <EmptyState
            title="No Games Found"
            description="No games match your current filters. Try adjusting your search criteria or add a new game."
            actionLabel="Add Game"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : displayMode === "grid" ? (
          <AdminGrid
            items={games.map((game): AdminGridItem => ({
              id: game.id,
              title: game.title,
              description: game.description,
              image: game.coverImage,
              imageAlt: game.title,
              icon: <Gamepad2 className="w-6 h-6" />,
              iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
              badges: [
                { 
                  label: game.category?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown", 
                  variant: game.category === "current" ? "success" as const : 
                           game.category === "childhood" ? "info" as const :
                           game.category === "planned" ? "warning" as const : "default" as const
                },
                ...(game.visible ? [] : [{ label: "Hidden", variant: "error" as const }])
              ],
              metadata: [
                { label: "Platform", value: game.platform },
                ...(game.rating > 0 ? [{ label: "Rating", value: `${game.rating}/10` }] : []),
                ...(game.genre ? [{ label: "Genre", value: game.genre }] : []),
                ...(game.playtime ? [{ label: "Playtime", value: `${game.playtime}h` }] : []),
                ...(game.steamUrl ? [{ label: "Steam", value: "Available" }] : [])
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditGame(game),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(game),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No games found"
            emptyAction={{
              label: "Add Game",
              onClick: () => setIsCreateModalOpen(true)
            }}
            columns={3}
          />
        ) : (
          <AdminList
            items={games.map((game): AdminListItem => ({
              id: game.id,
              title: game.title,
              description: game.description,
              image: game.coverImage,
              imageAlt: game.title,
              icon: <Gamepad2 className="w-6 h-6" />,
              iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
              badges: [
                { 
                  label: game.category?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown", 
                  variant: game.category === "current" ? "success" as const : 
                           game.category === "childhood" ? "info" as const :
                           game.category === "planned" ? "warning" as const : "default" as const
                },
                ...(game.visible ? [] : [{ label: "Hidden", variant: "error" as const }])
              ],
              metadata: [
                { label: "Platform", value: game.platform },
                ...(game.rating > 0 ? [{ label: "Rating", value: `${game.rating}/10` }] : []),
                ...(game.genre ? [{ label: "Genre", value: game.genre }] : []),
                ...(game.playtime ? [{ label: "Playtime", value: `${game.playtime}h` }] : []),
                ...(game.steamUrl ? [{ label: "Steam", value: "Available" }] : [])
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditGame(game),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(game),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No games found"
            emptyAction={{
              label: "Add Game",
              onClick: () => setIsCreateModalOpen(true)
            }}
          />
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
