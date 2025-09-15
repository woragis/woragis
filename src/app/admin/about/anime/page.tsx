"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import {
  useAnime,
  useCreateAnime,
  useUpdateAnime,
  useDeleteAnime,
} from "@/hooks/about/useAnime";
import type { Anime, NewAnime, AnimeStatus } from "@/types";

export default function AnimeAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AnimeStatus | "all">(
    "all"
  );

  // Hooks
  const { data: anime, isLoading, error } = useAnime();
  const createAnime = useCreateAnime();
  const updateAnime = useUpdateAnime();
  const deleteAnime = useDeleteAnime();

  // Form state
  const [formData, setFormData] = useState<Partial<NewAnime>>({
    title: "",
    description: "",
    status: "want_to_watch",
    myAnimeListId: "",
    coverImage: "",
    genres: "",
    episodes: 0,
    currentEpisode: 0,
    rating: 0,
    notes: "",
    order: 0,
    visible: true,
  });

  const statusOptions: { value: AnimeStatus; label: string }[] = [
    { value: "want_to_watch", label: "Want to Watch" },
    { value: "watching", label: "Watching" },
    { value: "completed", label: "Completed" },
    { value: "dropped", label: "Dropped" },
    { value: "on_hold", label: "On Hold" },
  ];

  const filteredAnime =
    selectedStatus === "all"
      ? anime
      : anime?.filter((item) => item.status === selectedStatus) || [];

  const handleCreate = async () => {
    try {
      await createAnime.mutateAsync(formData as NewAnime);
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        status: "want_to_watch",
        myAnimeListId: "",
        coverImage: "",
        genres: "",
        episodes: 0,
        currentEpisode: 0,
        rating: 0,
        notes: "",
        order: 0,
        visible: true,
      });
    } catch (error) {
      console.error("Failed to create anime:", error);
    }
  };

  const handleEdit = (animeItem: Anime) => {
    setSelectedAnime(animeItem);
    setFormData({
      title: animeItem.title,
      description: animeItem.description,
      status: animeItem.status,
      myAnimeListId: animeItem.myAnimeListId,
      coverImage: animeItem.coverImage,
      genres: animeItem.genres ? animeItem.genres : "",
      episodes: animeItem.episodes,
      currentEpisode: animeItem.currentEpisode,
      rating: animeItem.rating,
      notes: animeItem.notes,
      order: animeItem.order,
      visible: animeItem.visible,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedAnime) return;

    try {
      await updateAnime.mutateAsync({
        id: selectedAnime.id,
        anime: formData,
      });
      setIsEditModalOpen(false);
      setSelectedAnime(null);
    } catch (error) {
      console.error("Failed to update anime:", error);
    }
  };

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading anime</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Anime List</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Anime
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <label className="flex items-center text-gray-700">
            <input
              type="radio"
              name="status"
              value="all"
              checked={selectedStatus === "all"}
              onChange={(e) =>
                setSelectedStatus(e.target.value as AnimeStatus | "all")
              }
              className="mr-2"
            />
            All
          </label>
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-gray-700"
            >
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={selectedStatus === option.value}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as AnimeStatus)
                }
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Anime Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredAnime?.map((animeItem) => (
            <li key={animeItem.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {animeItem.coverImage ? (
                      <img
                        className="h-12 w-8 rounded object-cover"
                        src={animeItem.coverImage}
                        alt={animeItem.title}
                      />
                    ) : (
                      <div className="h-12 w-8 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">📺</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {animeItem.title}
                      </h3>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          animeItem.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : animeItem.status === "watching"
                            ? "bg-blue-100 text-blue-800"
                            : animeItem.status === "want_to_watch"
                            ? "bg-yellow-100 text-yellow-800"
                            : animeItem.status === "dropped"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {
                          statusOptions.find(
                            (s) => s.value === animeItem.status
                          )?.label
                        }
                      </span>
                    </div>
                    {animeItem.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {animeItem.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-400">
                        Episodes: {animeItem.currentEpisode || 0}/
                        {animeItem.episodes || "?"}
                      </span>
                      {animeItem.rating && (
                        <span className="text-xs text-gray-400">
                          Rating: {animeItem.rating}/10
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Order: {animeItem.order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      animeItem.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {animeItem.visible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    onClick={() => handleEdit(animeItem)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(animeItem)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredAnime?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No anime found. Add some anime to get started!
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Anime"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              value={formData.status || "want_to_watch"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as AnimeStatus,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Episodes
              </label>
              <input
                type="number"
                value={formData.episodes || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    episodes: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Episode
              </label>
              <input
                type="number"
                value={formData.currentEpisode || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentEpisode: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              MyAnimeList ID
            </label>
            <input
              type="text"
              value={formData.myAnimeListId || ""}
              onChange={(e) =>
                setFormData({ ...formData, myAnimeListId: e.target.value })
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
              disabled={createAnime.isPending || !formData.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createAnime.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAnime(null);
        }}
        title="Edit Anime"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              value={formData.status || "want_to_watch"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as AnimeStatus,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Episodes
              </label>
              <input
                type="number"
                value={formData.episodes || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    episodes: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Episode
              </label>
              <input
                type="number"
                value={formData.currentEpisode || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentEpisode: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              MyAnimeList ID
            </label>
            <input
              type="text"
              value={formData.myAnimeListId || ""}
              onChange={(e) =>
                setFormData({ ...formData, myAnimeListId: e.target.value })
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
                setSelectedAnime(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateAnime.isPending || !formData.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {updateAnime.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
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
    </div>
  );
}
