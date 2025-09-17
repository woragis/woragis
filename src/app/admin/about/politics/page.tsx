"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import {
  PoliticsForm,
  DeleteConfirmationModal,
} from "@/components/pages/admin";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  usePoliticalViews,
  useCreatePoliticalView,
  useUpdatePoliticalView,
  useDeletePoliticalView,
  useTogglePoliticalViewVisibility,
} from "@/hooks/about/usePolitics";
import type { PoliticalView, NewPoliticalView } from "@/types";

export default function PoliticsAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPoliticalView, setSelectedPoliticalView] =
    useState<PoliticalView | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks
  const { data: politicalViews, isLoading, error } = usePoliticalViews();
  const createPoliticalView = useCreatePoliticalView();
  const updatePoliticalView = useUpdatePoliticalView();
  const deletePoliticalView = useDeletePoliticalView();
  const toggleVisibility = useTogglePoliticalViewVisibility();

  const searchedPoliticalViews =
    politicalViews?.filter(
      (item) =>
        item.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.politicalParty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create political view
  const handleCreatePoliticalView = async (
    politicalViewData: NewPoliticalView
  ) => {
    try {
      await createPoliticalView.mutateAsync(politicalViewData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create political view:", error);
    }
  };

  // Edit political view
  const handleEditPoliticalView = (politicalViewItem: PoliticalView) => {
    setSelectedPoliticalView(politicalViewItem);
    setIsEditModalOpen(true);
  };

  const handleUpdatePoliticalView = async (
    politicalViewData: NewPoliticalView
  ) => {
    if (!selectedPoliticalView) return;

    try {
      await updatePoliticalView.mutateAsync({
        id: selectedPoliticalView.id,
        politicalView: politicalViewData,
      });
      setIsEditModalOpen(false);
      setSelectedPoliticalView(null);
    } catch (error) {
      console.error("Failed to update political view:", error);
    }
  };

  // Delete political view
  const handleDeletePoliticalView = (politicalViewItem: PoliticalView) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading political views</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Political View
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Political Views"
        description="Manage your political views and figures you follow"
        headerActions={headerActions}
      >
        {/* Search */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search political views..."
          selectedFilter=""
          onFilterChange={() => {}}
        />

        {/* Political Views List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedPoliticalViews?.map((politicalViewItem) => (
              <li key={politicalViewItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {politicalViewItem.personName}
                        </h3>
                        {!politicalViewItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {politicalViewItem.description}
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {politicalViewItem.politicalParty &&
                            `Party: ${politicalViewItem.politicalParty}`}
                          {politicalViewItem.position &&
                            ` • Position: ${politicalViewItem.position}`}
                          {politicalViewItem.order &&
                            ` • Order: ${politicalViewItem.order}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleToggleVisibility(politicalViewItem.id)
                      }
                      className={`px-3 py-1 text-xs rounded-full ${
                        politicalViewItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {politicalViewItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditPoliticalView(politicalViewItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeletePoliticalView(politicalViewItem)
                      }
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </AdminPageLayout>

      {/* Create Political View Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Political View"
        size="lg"
      >
        <PoliticsForm
          onSubmit={handleCreatePoliticalView}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createPoliticalView.isPending}
        />
      </Modal>

      {/* Edit Political View Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPoliticalView(null);
        }}
        title="Edit Political View"
        size="lg"
      >
        {selectedPoliticalView && (
          <PoliticsForm
            politicalView={selectedPoliticalView}
            onSubmit={handleUpdatePoliticalView}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedPoliticalView(null);
            }}
            isLoading={updatePoliticalView.isPending}
          />
        )}
      </Modal>

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
    </>
  );
}
