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
  AdminList,
  AdminGrid,
  DisplayToggle,
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
import type { AdminListItem } from "@/components/ui/admin/AdminList";
import type { AdminGridItem } from "@/components/ui/admin/AdminGrid";
import { useDisplay } from "@/contexts/DisplayContext";

export default function FrameworksAdminPage() {
  const [filters, setFilters] = useState<FrameworkFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { displayMode } = useDisplay();
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
              <option value="tool">Tools</option>
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
            <DisplayToggle />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Framework
            </Button>
          </form>
        </Card>

        {/* Frameworks Display */}
        {frameworks.length === 0 ? (
          <EmptyState
            title="No Frameworks Found"
            description="No frameworks match your current filters. Try adjusting your search criteria or add a new framework."
            actionLabel="Add Framework"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : displayMode === "grid" ? (
          <AdminGrid
            items={frameworks.map((framework): AdminGridItem => ({
              id: framework.id,
              title: framework.name,
              description: framework.description || undefined,
              icon: framework.icon || framework.name.charAt(0).toUpperCase(),
              iconBg: framework.color || "#3B82F6",
              badges: [
                { 
                  label: framework.type, 
                  variant: framework.type === "framework" ? "info" as const : 
                          framework.type === "language" ? "success" as const : 
                          "warning" as const 
                },
                ...(framework.visible ? [] : [{ label: "Hidden", variant: "error" as const }])
              ],
              metadata: [
                { label: "Slug", value: framework.slug },
                { label: "Order", value: framework.order?.toString() || "0" },
                ...(framework.version ? [{ label: "Version", value: `v${framework.version}` }] : []),
                ...(framework.website ? [{ label: "Website", value: "Available" }] : [])
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditFramework(framework),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(framework),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No frameworks found"
            emptyAction={{
              label: "Add Framework",
              onClick: () => setIsCreateModalOpen(true)
            }}
            columns={3}
          />
        ) : (
          <AdminList
            items={frameworks.map((framework): AdminListItem => ({
              id: framework.id,
              title: framework.name,
              description: framework.description || undefined,
              badges: [
                { 
                  label: framework.type, 
                  variant: framework.type === "framework" ? "info" as const : 
                          framework.type === "language" ? "success" as const : 
                          "warning" as const 
                },
                ...(framework.visible ? [] : [{ label: "Hidden", variant: "error" as const }])
              ],
              metadata: [
                { label: "Slug", value: framework.slug },
                { label: "Order", value: framework.order?.toString() || "0" },
                ...(framework.version ? [{ label: "Version", value: `v${framework.version}` }] : []),
                ...(framework.website ? [{ label: "Website", value: "Available" }] : [])
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditFramework(framework),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(framework),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No frameworks found"
            emptyAction={{
              label: "Add Framework",
              onClick: () => setIsCreateModalOpen(true)
            }}
          />
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
