"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import {
  useGames,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
} from "@/hooks/about/useGames";
import type { Game, NewGame, GameCategory } from "@/types";

export default function GamesAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    GameCategory | "all"
  >("all");

  // Hooks
  const { data: games, isLoading, error } = useGames();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();

  // Form state
  const [formData, setFormData] = useState<Partial<NewGame>>({
    title: "",
    description: "",
    category: "current",
    platform: "",
    genre: "",
    coverImage: "",
    steamUrl: "",
    playtime: 0,
    rating: 0,
    notes: "",
    order: 0,
    visible: true,
  });

  const categoryOptions: { value: GameCategory; label: string }[] = [
    { value: "childhood", label: "Childhood" },
    { value: "current", label: "Current" },
    { value: "planned", label: "Planned" },
  ];

  const filteredGames =
    selectedCategory === "all"
      ? games
      : games?.filter((game) => game.category === selectedCategory) || [];

  const handleCreate = async () => {
    try {
      await createGame.mutateAsync(formData as NewGame);
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "current",
        platform: "",
        genre: "",
        coverImage: "",
        steamUrl: "",
        playtime: 0,
        rating: 0,
        notes: "",
        order: 0,
        visible: true,
      });
    } catch (error) {
      console.error("Failed to create game:", error);
    }
  };

  const handleEdit = (game: Game) => {
    setSelectedGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      category: game.category,
      platform: game.platform,
      genre: game.genre,
      coverImage: game.coverImage,
      steamUrl: game.steamUrl,
      playtime: game.playtime,
      rating: game.rating,
      notes: game.notes,
      order: game.order,
      visible: game.visible,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedGame) return;

    try {
      await updateGame.mutateAsync({
        id: selectedGame.id,
        game: formData,
      });
      setIsEditModalOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error("Failed to update game:", error);
    }
  };

  const handleDelete = (game: Game) => {
    setSelectedGame(game);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading games</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Games</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Game
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <label className="flex items-center text-gray-700">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === "all"}
              onChange={(e) =>
                setSelectedCategory(e.target.value as GameCategory | "all")
              }
              className="mr-2"
            />
            All
          </label>
          {categoryOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-gray-700"
            >
              <input
                type="radio"
                name="category"
                value={option.value}
                checked={selectedCategory === option.value}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as GameCategory)
                }
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredGames?.map((game) => (
            <li key={game.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {game.coverImage ? (
                      <img
                        className="h-16 w-12 rounded object-cover"
                        src={game.coverImage}
                        alt={game.title}
                      />
                    ) : (
                      <div className="h-16 w-12 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">🎮</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {game.title}
                      </h3>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          game.category === "current"
                            ? "bg-blue-100 text-blue-800"
                            : game.category === "childhood"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {
                          categoryOptions.find((c) => c.value === game.category)
                            ?.label
                        }
                      </span>
                    </div>
                    {game.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {game.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center space-x-4">
                      {game.platform && (
                        <span className="text-xs text-gray-400">
                          {game.platform}
                        </span>
                      )}
                      {game.genre && (
                        <span className="text-xs text-gray-400">
                          {game.genre}
                        </span>
                      )}
                      {game.playtime && (
                        <span className="text-xs text-gray-400">
                          {game.playtime}h played
                        </span>
                      )}
                      {game.rating && (
                        <span className="text-xs text-gray-400">
                          Rating: {game.rating}/10
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Order: {game.order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      game.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {game.visible ? "Visible" : "Hidden"}
                  </span>
                  {game.steamUrl && (
                    <a
                      href={game.steamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Steam
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(game)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(game)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredGames?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No games found. Add some games to get started!
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Game"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              value={formData.category || "current"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as GameCategory,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <input
                type="text"
                value={formData.platform || ""}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., PC, PlayStation, Xbox"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <input
                type="text"
                value={formData.genre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., RPG, Action, Strategy"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Playtime (hours)
              </label>
              <input
                type="number"
                value={formData.playtime || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    playtime: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.rating || 0}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Steam URL
            </label>
            <input
              type="url"
              value={formData.steamUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, steamUrl: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order
            </label>
            <input
              type="number"
              value={formData.order || 0}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible || false}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="visible"
              className="ml-2 block text-sm text-gray-900"
            >
              Visible
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createGame.isPending || !formData.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createGame.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGame(null);
        }}
        title="Edit Game"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              value={formData.category || "current"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as GameCategory,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <input
                type="text"
                value={formData.platform || ""}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., PC, PlayStation, Xbox"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <input
                type="text"
                value={formData.genre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., RPG, Action, Strategy"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Playtime (hours)
              </label>
              <input
                type="number"
                value={formData.playtime || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    playtime: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.rating || 0}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Steam URL
            </label>
            <input
              type="url"
              value={formData.steamUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, steamUrl: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order
            </label>
            <input
              type="number"
              value={formData.order || 0}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible-edit"
              checked={formData.visible || false}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="visible-edit"
              className="ml-2 block text-sm text-gray-900"
            >
              Visible
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedGame(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateGame.isPending || !formData.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {updateGame.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
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
    </div>
  );
}
