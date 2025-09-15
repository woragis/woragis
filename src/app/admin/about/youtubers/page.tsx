"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import {
  YouTubersForm,
  DeleteConfirmationModal,
} from "@/components/pages/admin";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  useYoutubers,
  useCreateYoutuber,
  useUpdateYoutuber,
  useDeleteYoutuber,
  useToggleYoutuberVisibility,
} from "@/hooks/about/useYoutubers";
import type { Youtuber, NewYoutuber, YoutuberCategory } from "@/types";

const categoryOptions = [
  { value: "all", label: "All" },
  { value: "current", label: "Current" },
  { value: "childhood", label: "Childhood" },
];

export default function YouTubersAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedYouTuber, setSelectedYouTuber] = useState<Youtuber | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<
    YoutuberCategory | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks
  const { data: youTubers, isLoading, error } = useYoutubers();
  const createYouTuber = useCreateYoutuber();
  const updateYouTuber = useUpdateYoutuber();
  const deleteYouTuber = useDeleteYoutuber();
  const toggleVisibility = useToggleYoutuberVisibility();

  const filteredYouTubers =
    selectedCategory === "all"
      ? youTubers
      : youTubers?.filter((item) => item.category === selectedCategory) || [];

  const searchedYouTubers =
    filteredYouTubers?.filter(
      (item) =>
        item.channelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contentType?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create YouTuber
  const handleCreateYouTuber = async (youTuberData: NewYoutuber) => {
    try {
      await createYouTuber.mutateAsync(youTuberData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create YouTuber:", error);
    }
  };

  // Edit YouTuber
  const handleEditYouTuber = (youTuberItem: Youtuber) => {
    setSelectedYouTuber(youTuberItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateYouTuber = async (youTuberData: NewYoutuber) => {
    if (!selectedYouTuber) return;

    try {
      await updateYouTuber.mutateAsync({
        id: selectedYouTuber.id,
        youtuber: youTuberData,
      });
      setIsEditModalOpen(false);
      setSelectedYouTuber(null);
    } catch (error) {
      console.error("Failed to update YouTuber:", error);
    }
  };

  // Delete YouTuber
  const handleDeleteYouTuber = (youTuberItem: Youtuber) => {
    setSelectedYouTuber(youTuberItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedYouTuber) return;

    try {
      await deleteYouTuber.mutateAsync(selectedYouTuber.id);
      setIsDeleteModalOpen(false);
      setSelectedYouTuber(null);
    } catch (error) {
      console.error("Failed to delete YouTuber:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading YouTubers</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add YouTuber
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="YouTubers"
        description="Manage YouTubers you watch currently and from childhood"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search YouTubers..."
          filterOptions={categoryOptions}
          selectedFilter={selectedCategory}
          onFilterChange={(value) =>
            setSelectedCategory(value as YoutuberCategory | "all")
          }
        />

        {/* YouTubers List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedYouTubers?.map((youTuberItem) => (
              <li key={youTuberItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={youTuberItem.profileImage}
                        alt={youTuberItem.channelName}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {youTuberItem.channelName}
                        </h3>
                        {!youTuberItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {youTuberItem.description}
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Category:{" "}
                          {youTuberItem.category
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          {youTuberItem.contentType &&
                            ` • Content: ${youTuberItem.contentType}`}
                          {youTuberItem.subscriberCount &&
                            ` • Subscribers: ${youTuberItem.subscriberCount}`}
                          {youTuberItem.youtubeUrl && ` • YouTube Available`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(youTuberItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        youTuberItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {youTuberItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditYouTuber(youTuberItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteYouTuber(youTuberItem)}
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

      {/* Create YouTuber Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New YouTuber"
        size="lg"
      >
        <YouTubersForm
          onSubmit={handleCreateYouTuber}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createYouTuber.isPending}
        />
      </Modal>

      {/* Edit YouTuber Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedYouTuber(null);
        }}
        title="Edit YouTuber"
        size="lg"
      >
        {selectedYouTuber && (
          <YouTubersForm
            youTuber={selectedYouTuber}
            onSubmit={handleUpdateYouTuber}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedYouTuber(null);
            }}
            isLoading={updateYouTuber.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedYouTuber(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete YouTuber"
        message="Are you sure you want to delete this YouTuber? This action cannot be undone."
        itemName={selectedYouTuber?.channelName}
        isLoading={deleteYouTuber.isPending}
      />
    </>
  );
}
