"use client";

import React, { useState, useCallback } from "react";
import {
  useFrameworks,
  useDeleteFramework,
  useCreateFramework,
  useUpdateFramework,
} from "@/hooks/useFrameworks";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import { FrameworkForm } from "@/components/pages/admin/frameworks";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Code,
  Globe,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";
import type {
  FrameworkFilters,
  NewFramework,
  Framework,
  FrameworkType,
} from "@/types";

export default function FrameworksAdminPage() {
  const [filters, setFilters] = useState<FrameworkFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: frameworks = [], isLoading, error } = useFrameworks(filters);
  const createFramework = useCreateFramework();
  const updateFramework = useUpdateFramework();
  const deleteFramework = useDeleteFramework();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create framework
  const handleCreateFramework = useCallback(async (frameworkData: any) => {
    try {
      await createFramework.mutateAsync(frameworkData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create framework:", error);
    }
  }, [createFramework]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateFramework(createFormData);
    }
  }, [createFormData, handleCreateFramework]);

  // Edit framework
  const handleEditFramework = (framework: Framework) => {
    setSelectedFramework(framework);
    setIsEditModalOpen(true);
  };

  const handleUpdateFramework = useCallback(async (frameworkData: any) => {
    if (!selectedFramework) return;

    try {
      await updateFramework.mutateAsync({
        id: selectedFramework.id,
        framework: frameworkData,
      });
      setIsEditModalOpen(false);
      setSelectedFramework(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update framework:", error);
    }
  }, [selectedFramework, updateFramework]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedFramework) {
      handleUpdateFramework(editFormData);
    }
  }, [editFormData, selectedFramework, handleUpdateFramework]);

  // Delete framework
  const handleDelete = (framework: Framework) => {
    setSelectedFramework(framework);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFramework) return;

    try {
      await deleteFramework.mutateAsync(selectedFramework.id);
      setIsDeleteModalOpen(false);
      setSelectedFramework(null);
    } catch (error) {
      console.error("Failed to delete framework:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frameworks & Languages
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your frameworks and programming languages
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
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
            title="Unable to Load Frameworks"
            description="There was an error loading the frameworks. Please try again later."
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
            Frameworks & Languages
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your frameworks and programming languages
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search frameworks and languages..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.type || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.value ? (e.target.value as FrameworkType) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="framework">Frameworks</option>
              <option value="language">Languages</option>
            </select>
            <select
              value={filters.visible?.toString() || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  visible: e.target.value
                    ? e.target.value === "true"
                    : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Visibility</option>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Framework
            </Button>
          </form>
        </Card>

        {/* Frameworks Grid */}
        {frameworks.length === 0 ? (
          <EmptyState
            title="No Frameworks Found"
            description="No frameworks match your current filters. Try adjusting your search criteria or add a new framework."
            actionLabel="Add Framework"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {frameworks.map((framework) => (
              <Card key={framework.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4"
                        style={{ backgroundColor: framework.color || "#3B82F6" }}
                      >
                        {framework.icon || framework.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {framework.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {framework.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditFramework(framework)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(framework)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {framework.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                      {framework.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Code className="w-4 h-4 mr-1" />
                        Order: {framework.order}
                      </div>
                      {framework.version && (
                        <div className="flex items-center">
                          <span className="text-xs">v{framework.version}</span>
                        </div>
                      )}
                    </div>
                    {framework.website && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Globe className="w-4 h-4 mr-1" />
                        <a
                          href={framework.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        framework.type === "framework"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      }`}
                    >
                      {framework.type}
                    </span>
                    {framework.visible ? (
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

        {/* Create Framework Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Framework"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createFramework.isPending}
          maxHeight="90vh"
        >
          <FrameworkForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createFramework.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Framework Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedFramework(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Framework"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedFramework(null);
            setEditFormData(null);
          }}
          isLoading={updateFramework.isPending}
          maxHeight="90vh"
        >
          {selectedFramework && (
            <FrameworkForm
              framework={selectedFramework}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedFramework(null);
              }}
              isLoading={updateFramework.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedFramework(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Framework"
          message="Are you sure you want to delete this framework? This action cannot be undone."
          itemName={selectedFramework?.name}
          isLoading={deleteFramework.isPending}
        />
      </Container>
    </div>
  );
}
