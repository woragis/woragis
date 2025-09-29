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
  PoliticsForm,
  DeleteConfirmationModal,
} from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Eye,
  EyeOff,
  Calendar,
  Hash,
} from "lucide-react";
import {
  usePoliticalViews,
  useCreatePoliticalView,
  useUpdatePoliticalView,
  useDeletePoliticalView,
  useTogglePoliticalViewVisibility,
} from "@/hooks/about/usePolitics";
import type { PoliticalView, NewPoliticalView } from "@/types";

export default function PoliticsAdminPage() {
  const [filters, setFilters] = useState<{ search?: string }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPoliticalView, setSelectedPoliticalView] =
    useState<PoliticalView | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: politicalViews = [], isLoading, error } = usePoliticalViews();
  const createPoliticalView = useCreatePoliticalView();
  const updatePoliticalView = useUpdatePoliticalView();
  const deletePoliticalView = useDeletePoliticalView();
  const toggleVisibility = useTogglePoliticalViewVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create political view
  const handleCreatePoliticalView = useCallback(async (politicalViewData: any) => {
    try {
      await createPoliticalView.mutateAsync(politicalViewData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create political view:", error);
    }
  }, [createPoliticalView]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreatePoliticalView(createFormData);
    }
  }, [createFormData, handleCreatePoliticalView]);

  // Edit political view
  const handleEditPoliticalView = (politicalViewItem: PoliticalView) => {
    setSelectedPoliticalView(politicalViewItem);
    setIsEditModalOpen(true);
  };

  const handleUpdatePoliticalView = useCallback(async (politicalViewData: any) => {
    if (!selectedPoliticalView) return;

    try {
      await updatePoliticalView.mutateAsync({
        id: selectedPoliticalView.id,
        politicalView: politicalViewData,
      });
      setIsEditModalOpen(false);
      setSelectedPoliticalView(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update political view:", error);
    }
  }, [selectedPoliticalView, updatePoliticalView]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedPoliticalView) {
      handleUpdatePoliticalView(editFormData);
    }
  }, [editFormData, selectedPoliticalView, handleUpdatePoliticalView]);

  // Delete political view
  const handleDelete = (politicalViewItem: PoliticalView) => {
    setSelectedPoliticalView(politicalViewItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPoliticalView) return;

    try {
      await deletePoliticalView.mutateAsync(selectedPoliticalView.id);
      setIsDeleteModalOpen(false);
      setSelectedPoliticalView(null);
    } catch (error) {
      console.error("Failed to delete political view:", error);
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
              Political Views
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your political views and figures you follow
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
            title="Unable to Load Political Views"
            description="There was an error loading the political views. Please try again later."
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
            Political Views
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your political views and figures you follow
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search political views..."
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
              Add Political View
            </Button>
          </form>
        </Card>

        {/* Political Views Grid */}
        {politicalViews.length === 0 ? (
          <EmptyState
            title="No Political Views Found"
            description="No political views match your current filters. Try adjusting your search criteria or add a new political view."
            actionLabel="Add Political View"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {politicalViews.map((politicalView) => (
              <Card key={politicalView.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {politicalView.personName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Political Figure
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPoliticalView(politicalView)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(politicalView)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {politicalView.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                      {politicalView.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {politicalView.politicalParty && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Hash className="w-4 h-4 mr-1" />
                        Party: {politicalView.politicalParty}
                      </div>
                    )}
                    {politicalView.position && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Hash className="w-4 h-4 mr-1" />
                        Position: {politicalView.position}
                      </div>
                    )}
                    {politicalView.order && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Hash className="w-4 h-4 mr-1" />
                        Order: {politicalView.order}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {new Date(politicalView.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {politicalView.visible ? (
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

        {/* Create Political View Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Political View"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createPoliticalView.isPending}
          maxHeight="90vh"
        >
          <PoliticsForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createPoliticalView.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Political View Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPoliticalView(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Political View"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedPoliticalView(null);
            setEditFormData(null);
          }}
          isLoading={updatePoliticalView.isPending}
          maxHeight="90vh"
        >
          {selectedPoliticalView && (
            <PoliticsForm
              politicalView={selectedPoliticalView}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedPoliticalView(null);
              }}
              isLoading={updatePoliticalView.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPoliticalView(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Political View"
          message="Are you sure you want to delete this political view? This action cannot be undone."
          itemName={selectedPoliticalView?.personName}
          isLoading={deletePoliticalView.isPending}
        />
      </Container>
    </div>
  );
}
