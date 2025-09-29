"use client";

import React, { useState, useCallback } from "react";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import { DeleteConfirmationModal, HobbiesForm } from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Heart,
  Eye,
  EyeOff,
  Calendar,
  Hash,
} from "lucide-react";
import {
  useHobbies,
  useCreateHobby,
  useUpdateHobby,
  useDeleteHobby,
  useToggleHobbyVisibility,
} from "@/hooks/about/useHobbies";
import { Hobby, NewHobby } from "@/types/about/hobbies";

export default function HobbiesAdminPage() {
  const [filters, setFilters] = useState<{ search?: string }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: hobbies = [], isLoading, error } = useHobbies();
  const createHobby = useCreateHobby();
  const updateHobby = useUpdateHobby();
  const deleteHobby = useDeleteHobby();
  const toggleVisibility = useToggleHobbyVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create hobby
  const handleCreateHobby = useCallback(async (hobbyData: any) => {
    try {
      await createHobby.mutateAsync(hobbyData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create hobby:", error);
    }
  }, [createHobby]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateHobby(createFormData);
    }
  }, [createFormData, handleCreateHobby]);

  // Edit hobby
  const handleEditHobby = (hobbyItem: Hobby) => {
    setSelectedHobby(hobbyItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateHobby = useCallback(async (hobbyData: any) => {
    if (!selectedHobby) return;

    try {
      await updateHobby.mutateAsync({
        id: selectedHobby.id,
        hobby: hobbyData,
      });
      setIsEditModalOpen(false);
      setSelectedHobby(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update hobby:", error);
    }
  }, [selectedHobby, updateHobby]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedHobby) {
      handleUpdateHobby(editFormData);
    }
  }, [editFormData, selectedHobby, handleUpdateHobby]);

  // Delete hobby
  const handleDelete = (hobbyItem: Hobby) => {
    setSelectedHobby(hobbyItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedHobby) return;

    try {
      await deleteHobby.mutateAsync(selectedHobby.id);
      setIsDeleteModalOpen(false);
      setSelectedHobby(null);
    } catch (error) {
      console.error("Failed to delete hobby:", error);
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
              Hobbies
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your hobbies and interests
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
            title="Unable to Load Hobbies"
            description="There was an error loading the hobbies. Please try again later."
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
            Hobbies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your hobbies and interests
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search hobbies..."
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
              Add Hobby
            </Button>
          </form>
        </Card>

        {/* Hobbies Grid */}
        {hobbies.length === 0 ? (
          <EmptyState
            title="No Hobbies Found"
            description="No hobbies match your current filters. Try adjusting your search criteria or add a new hobby."
            actionLabel="Add Hobby"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hobbies.map((hobby) => (
              <Card key={hobby.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {hobby.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Hobby
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditHobby(hobby)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(hobby)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {hobby.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                      {hobby.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {new Date(hobby.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {hobby.visible ? (
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

        {/* Create Hobby Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Hobby"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createHobby.isPending}
          maxHeight="90vh"
        >
          <HobbiesForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createHobby.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Hobby Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedHobby(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Hobby"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedHobby(null);
            setEditFormData(null);
          }}
          isLoading={updateHobby.isPending}
          maxHeight="90vh"
        >
          {selectedHobby && (
            <HobbiesForm
              hobby={selectedHobby}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedHobby(null);
              }}
              isLoading={updateHobby.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedHobby(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Hobby"
          message="Are you sure you want to delete this hobby? This action cannot be undone."
          itemName={selectedHobby?.name}
          isLoading={deleteHobby.isPending}
        />
      </Container>
    </div>
  );
}
