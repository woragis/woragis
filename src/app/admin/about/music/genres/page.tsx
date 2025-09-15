"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import type { MusicGenre, NewMusicGenre } from "@/types";

export default function MusicGenresAdminPage() {
  const [genres, setGenres] = useState<MusicGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<NewMusicGenre>>({
    name: "",
    description: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/admin/about/music/genres");
      const data = await response.json();
      if (data.success) {
        setGenres(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch genres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      const response = await fetch("/api/admin/about/music/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchGenres();
        setIsCreateModalOpen(false);
        setFormData({ name: "", description: "", order: 0, visible: true });
      } else {
        console.error("Failed to create genre:", data.error);
      }
    } catch (error) {
      console.error("Failed to create genre:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (genre: MusicGenre) => {
    setSelectedGenre(genre);
    setFormData({
      name: genre.name,
      description: genre.description,
      order: genre.order,
      visible: genre.visible,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedGenre) return;

    try {
      setIsCreating(true);
      const response = await fetch(
        `/api/admin/about/music/genres/${selectedGenre.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchGenres();
        setIsEditModalOpen(false);
        setSelectedGenre(null);
      } else {
        console.error("Failed to update genre:", data.error);
      }
    } catch (error) {
      console.error("Failed to update genre:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (genre: MusicGenre) => {
    setSelectedGenre(genre);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGenre) return;

    try {
      const response = await fetch(
        `/api/admin/about/music/genres/${selectedGenre.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchGenres();
        setIsDeleteModalOpen(false);
        setSelectedGenre(null);
      } else {
        console.error("Failed to delete genre:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete genre:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Music Genres</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Genre
        </button>
      </div>

      {/* Genres Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {genres.map((genre) => (
            <li key={genre.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {genre.name}
                  </h3>
                  {genre.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {genre.description}
                    </p>
                  )}
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-400">
                      Order: {genre.order}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      genre.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {genre.visible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    onClick={() => handleEdit(genre)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(genre)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Music Genre"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
              disabled={isCreating || !formData.name}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGenre(null);
        }}
        title="Edit Music Genre"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
                setSelectedGenre(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isCreating || !formData.name}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>

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
        isLoading={false}
      />
    </div>
  );
}
