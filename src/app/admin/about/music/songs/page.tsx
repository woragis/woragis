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
import {
  MusicSongsForm,
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
  User,
  Disc,
} from "lucide-react";
import {
  useLastListenedSongs,
  useCreateLastListenedSong,
  useUpdateLastListenedSong,
  useDeleteLastListenedSong,
  useToggleLastListenedSongVisibility,
} from "@/hooks/about/useMusic";
import type { LastListenedSong, NewLastListenedSong } from "@/types";

export default function LastListenedSongsAdminPage() {
  const [filters, setFilters] = useState<{ search?: string }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<LastListenedSong | null>(
    null
  );
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: songs = [], isLoading, error } = useLastListenedSongs();
  const createSong = useCreateLastListenedSong();
  const updateSong = useUpdateLastListenedSong();
  const deleteSong = useDeleteLastListenedSong();
  const toggleVisibility = useToggleLastListenedSongVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create song
  const handleCreateSong = useCallback(async (songData: any) => {
    try {
      await createSong.mutateAsync(songData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create song:", error);
    }
  }, [createSong]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateSong(createFormData);
    }
  }, [createFormData, handleCreateSong]);

  // Edit song
  const handleEditSong = (songItem: LastListenedSong) => {
    setSelectedSong(songItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateSong = useCallback(async (songData: any) => {
    if (!selectedSong) return;

    try {
      await updateSong.mutateAsync({
        id: selectedSong.id,
        song: songData,
      });
      setIsEditModalOpen(false);
      setSelectedSong(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update song:", error);
    }
  }, [selectedSong, updateSong]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedSong) {
      handleUpdateSong(editFormData);
    }
  }, [editFormData, selectedSong, handleUpdateSong]);

  // Delete song
  const handleDelete = (songItem: LastListenedSong) => {
    setSelectedSong(songItem);
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

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Last Listened Songs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your recently played tracks and music history
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
            title="Unable to Load Songs"
            description="There was an error loading the songs. Please try again later."
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
            Last Listened Songs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your recently played tracks and music history
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search songs..."
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
              Add Song
            </Button>
          </form>
        </Card>

        {/* Songs Grid */}
        {songs.length === 0 ? (
          <EmptyState
            title="No Songs Found"
            description="No songs match your current filters. Try adjusting your search criteria or add a new song."
            actionLabel="Add Song"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {songs.map((song) => (
              <Card key={song.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        <Music className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSong(song)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(song)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Album info */}
                  {song.album && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Disc className="w-4 h-4 mr-1" />
                      {song.album}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {song.listenedAt && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        Last listened: {new Date(song.listenedAt).toLocaleDateString()}
                      </div>
                    )}
                    {song.order && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Hash className="w-4 h-4 mr-1" />
                        Order: {song.order}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {song.createdAt ? new Date(song.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {song.visible ? (
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

        {/* Create Song Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Song"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createSong.isPending}
          maxHeight="90vh"
        >
          <MusicSongsForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createSong.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Song Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSong(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Song"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedSong(null);
            setEditFormData(null);
          }}
          isLoading={updateSong.isPending}
          maxHeight="90vh"
        >
          {selectedSong && (
            <MusicSongsForm
              song={selectedSong}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedSong(null);
              }}
              isLoading={updateSong.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

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
      </Container>
    </div>
  );
}
