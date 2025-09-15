"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import {
  useLastListenedSongs,
  useCreateLastListenedSong,
  useUpdateLastListenedSong,
  useDeleteLastListenedSong,
} from "@/hooks/about/useMusic";
import type { LastListenedSong, NewLastListenedSong } from "@/types";

export default function LastListenedSongsAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<LastListenedSong | null>(
    null
  );

  // Hooks
  const { data: songs, isLoading, error } = useLastListenedSongs();
  const createSong = useCreateLastListenedSong();
  const updateSong = useUpdateLastListenedSong();
  const deleteSong = useDeleteLastListenedSong();

  // Form state
  const [formData, setFormData] = useState<Partial<NewLastListenedSong>>({
    title: "",
    artist: "",
    album: "",
    spotifyUrl: "",
    youtubeUrl: "",
    order: 0,
    visible: true,
  });

  const handleCreate = async () => {
    try {
      await createSong.mutateAsync(formData as NewLastListenedSong);
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        artist: "",
        album: "",
        spotifyUrl: "",
        youtubeUrl: "",
        order: 0,
        visible: true,
      });
    } catch (error) {
      console.error("Failed to create song:", error);
    }
  };

  const handleEdit = (song: LastListenedSong) => {
    setSelectedSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album,
      spotifyUrl: song.spotifyUrl,
      youtubeUrl: song.youtubeUrl,
      order: song.order,
      visible: song.visible,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedSong) return;

    try {
      await updateSong.mutateAsync({
        id: selectedSong.id,
        song: formData,
      });
      setIsEditModalOpen(false);
      setSelectedSong(null);
    } catch (error) {
      console.error("Failed to update song:", error);
    }
  };

  const handleDelete = (song: LastListenedSong) => {
    setSelectedSong(song);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSong) return;

    try {
      await deleteSong.mutateAsync(selectedSong.id);
      setIsDeleteModalOpen(false);
      setSelectedSong(null);
    } catch (error) {
      console.error("Failed to delete song:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading songs</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Last Listened Songs
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Song
        </button>
      </div>

      {/* Songs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {songs?.map((song) => (
            <li key={song.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">♪</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {song.title}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">
                        by {song.artist}
                      </span>
                    </div>
                    {song.album && (
                      <p className="text-sm text-gray-500 mt-1">
                        Album: {song.album}
                      </p>
                    )}
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-400">
                        Order: {song.order}
                      </span>
                      <span className="text-xs text-gray-400">
                        Listened:{" "}
                        {song.listenedAt
                          ? new Date(song.listenedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      song.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {song.visible ? "Visible" : "Hidden"}
                  </span>
                  {song.spotifyUrl && (
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Spotify
                    </a>
                  )}
                  {song.youtubeUrl && (
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      YouTube
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(song)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(song)}
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
        title="Create New Song"
        size="md"
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
              Artist *
            </label>
            <input
              type="text"
              value={formData.artist || ""}
              onChange={(e) =>
                setFormData({ ...formData, artist: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Album
            </label>
            <input
              type="text"
              value={formData.album || ""}
              onChange={(e) =>
                setFormData({ ...formData, album: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spotify URL
            </label>
            <input
              type="url"
              value={formData.spotifyUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, spotifyUrl: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              YouTube URL
            </label>
            <input
              type="url"
              value={formData.youtubeUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, youtubeUrl: e.target.value })
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
              disabled={
                createSong.isPending || !formData.title || !formData.artist
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createSong.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSong(null);
        }}
        title="Edit Song"
        size="md"
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
              Artist *
            </label>
            <input
              type="text"
              value={formData.artist || ""}
              onChange={(e) =>
                setFormData({ ...formData, artist: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Album
            </label>
            <input
              type="text"
              value={formData.album || ""}
              onChange={(e) =>
                setFormData({ ...formData, album: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spotify URL
            </label>
            <input
              type="url"
              value={formData.spotifyUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, spotifyUrl: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              YouTube URL
            </label>
            <input
              type="url"
              value={formData.youtubeUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, youtubeUrl: e.target.value })
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
                setSelectedSong(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={
                updateSong.isPending || !formData.title || !formData.artist
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {updateSong.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSong(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Song"
        message="Are you sure you want to delete this song? This action cannot be undone."
        itemName={selectedSong?.title}
        isLoading={deleteSong.isPending}
      />
    </div>
  );
}
