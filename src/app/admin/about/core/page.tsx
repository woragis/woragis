"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import {
  AboutCoreForm,
  DeleteConfirmationModal,
} from "@/components/pages/admin";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  useAboutCore,
  useCreateAboutCore,
  useUpdateAboutCore,
  useDeleteAboutCore,
  useToggleAboutCoreVisibility,
} from "@/hooks/about/useAboutCore";
import type { AboutCore, NewAboutCore, AboutCoreResponse } from "@/types";

export default function AboutCoreAdminPage() {
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAboutCore, setSelectedAboutCore] = useState<AboutCore | null>(
    null
  );

  const { data: aboutCoreData, isLoading, error } = useAboutCore();
  const aboutCore = aboutCoreData?.about || null;
  const createAboutCore = useCreateAboutCore();
  const updateAboutCore = useUpdateAboutCore();
  const deleteAboutCore = useDeleteAboutCore();
  const toggleVisibility = useToggleAboutCoreVisibility();

  // Create about core
  const handleCreateAboutCore = async (aboutCoreData: NewAboutCore) => {
    try {
      await createAboutCore.mutateAsync(aboutCoreData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create about core:", error);
    }
  };

  // Edit about core
  const handleEditAboutCore = () => {
    if (aboutCore) {
      setSelectedAboutCore(aboutCore);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateAboutCore = async (aboutCoreData: NewAboutCore) => {
    if (!selectedAboutCore) return;

    try {
      await updateAboutCore.mutateAsync(aboutCoreData);
      setIsEditModalOpen(false);
      setSelectedAboutCore(null);
    } catch (error) {
      console.error("Failed to update about core:", error);
    }
  };

  // Delete about core
  const handleDeleteAboutCore = () => {
    if (aboutCore) {
      setSelectedAboutCore(aboutCore);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAboutCore) return;

    try {
      await deleteAboutCore.mutateAsync(selectedAboutCore.id);
      setIsDeleteModalOpen(false);
      setSelectedAboutCore(null);
    } catch (error) {
      console.error("Failed to delete about core:", error);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading about information</div>;

  const headerActions = (
    <ActionButton
      onClick={() => setIsCreateModalOpen(true)}
      disabled={!!aboutCore}
    >
      {aboutCore ? "About Configured" : "Create About"}
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="About Core Information"
        description="Manage your core personal information"
        headerActions={headerActions}
      >
        {/* About Core List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          {aboutCore ? (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {aboutCore.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {aboutCore.name}
                      </h3>
                      {!aboutCore.visible && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {aboutCore.biography && (
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: aboutCore.biography,
                          }}
                        />
                      )}
                    </div>
                    {aboutCore.featuredBiography && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                          Featured: {aboutCore.featuredBiography}
                        </p>
                      </div>
                    )}
                    <div className="mt-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {aboutCore.currentProfessionId &&
                          `Profession ID: ${aboutCore.currentProfessionId}`}
                        {aboutCore.createdAt &&
                          ` • Created: ${new Date(
                            aboutCore.createdAt
                          ).toLocaleDateString()}`}
                        {aboutCore.updatedAt &&
                          ` • Updated: ${new Date(
                            aboutCore.updatedAt
                          ).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleVisibility(aboutCore.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      aboutCore.visible
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {aboutCore.visible ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={handleEditAboutCore}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteAboutCore}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No about information configured yet.
              </p>
            </div>
          )}
        </div>
      </AdminPageLayout>

      {/* Create About Core Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create About Information"
        size="lg"
      >
        <AboutCoreForm
          onSubmit={handleCreateAboutCore}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createAboutCore.isPending}
        />
      </Modal>

      {/* Edit About Core Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAboutCore(null);
        }}
        title="Edit About Information"
        size="lg"
      >
        {selectedAboutCore && (
          <AboutCoreForm
            aboutCore={selectedAboutCore}
            onSubmit={handleUpdateAboutCore}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedAboutCore(null);
            }}
            isLoading={updateAboutCore.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAboutCore(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete About Information"
        message="Are you sure you want to delete your about information? This action cannot be undone."
        itemName={selectedAboutCore?.name}
        isLoading={deleteAboutCore.isPending}
      />
    </>
  );
}
