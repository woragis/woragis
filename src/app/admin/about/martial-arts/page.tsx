"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  DeleteConfirmationModal,
  MartialArtsForm,
} from "@/components/pages/admin";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  useMartialArts,
  useCreateMartialArt,
  useUpdateMartialArt,
  useDeleteMartialArt,
  useToggleMartialArtVisibility,
} from "@/hooks/about/useMartialArts";
import {
  MartialArt,
  NewMartialArt,
  KnowledgeLevel,
} from "@/types/about/martial-arts";
import { toast } from "sonner";

export default function MartialArtsAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMartialArt, setSelectedMartialArt] =
    useState<MartialArt | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data: martialArts = [], isLoading, error } = useMartialArts();
  const createMartialArt = useCreateMartialArt();
  const updateMartialArt = useUpdateMartialArt();
  const deleteMartialArt = useDeleteMartialArt();
  const toggleVisibility = useToggleMartialArtVisibility();

  const searchedMartialArts =
    martialArts?.filter(
      (item: MartialArt) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.grade?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create martial art
  const handleCreateMartialArt = async (martialArtData: NewMartialArt) => {
    try {
      await createMartialArt.mutateAsync(martialArtData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create martial art:", error);
    }
  };

  // Edit martial art
  const handleEditMartialArt = (martialArtItem: MartialArt) => {
    setSelectedMartialArt(martialArtItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateMartialArt = async (martialArtData: NewMartialArt) => {
    if (!selectedMartialArt) return;

    try {
      await updateMartialArt.mutateAsync({
        id: selectedMartialArt.id,
        martialArt: martialArtData,
      });
      setIsEditModalOpen(false);
      setSelectedMartialArt(null);
    } catch (error) {
      console.error("Failed to update martial art:", error);
    }
  };

  // Delete martial art
  const handleDeleteMartialArt = (martialArtItem: MartialArt) => {
    setSelectedMartialArt(martialArtItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMartialArt) return;

    try {
      await deleteMartialArt.mutateAsync(selectedMartialArt.id);
      setIsDeleteModalOpen(false);
      setSelectedMartialArt(null);
    } catch (error) {
      console.error("Failed to delete martial art:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  const getKnowledgeLevelColor = (level: KnowledgeLevel) => {
    switch (level) {
      case "expert":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "beginner":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getKnowledgeLevelLabel = (level: KnowledgeLevel) => {
    switch (level) {
      case "expert":
        return "Expert";
      case "advanced":
        return "Advanced";
      case "intermediate":
        return "Intermediate";
      case "beginner":
        return "Beginner";
      default:
        return level;
    }
  };

  if (error) return <div>Error loading martial arts</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Martial Art
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Martial Arts List"
        description="Manage your martial arts training and grades"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search martial arts..."
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Martial Arts List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedMartialArts?.map((martialArtItem: MartialArt) => (
              <li key={martialArtItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {martialArtItem.name}
                        </h3>
                        <Badge
                          className={getKnowledgeLevelColor(
                            martialArtItem.knowledgeLevel || "beginner"
                          )}
                        >
                          {getKnowledgeLevelLabel(
                            martialArtItem.knowledgeLevel || "beginner"
                          )}
                        </Badge>
                        {martialArtItem.grade && (
                          <Badge variant="outline">
                            {martialArtItem.grade}
                          </Badge>
                        )}
                        {!martialArtItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Added{" "}
                          {new Date(
                            martialArtItem.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(martialArtItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        martialArtItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {martialArtItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditMartialArt(martialArtItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMartialArt(martialArtItem)}
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

      {/* Create Martial Art Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Martial Art"
        size="lg"
      >
        <MartialArtsForm
          onSubmit={handleCreateMartialArt}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMartialArt.isPending}
        />
      </Modal>

      {/* Edit Martial Art Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMartialArt(null);
        }}
        title="Edit Martial Art"
        size="lg"
      >
        {selectedMartialArt && (
          <MartialArtsForm
            martialArt={selectedMartialArt}
            onSubmit={handleUpdateMartialArt}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedMartialArt(null);
            }}
            isLoading={updateMartialArt.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMartialArt(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Martial Art"
        message="Are you sure you want to delete this martial art? This action cannot be undone."
        itemName={selectedMartialArt?.name}
        isLoading={deleteMartialArt.isPending}
      />
    </>
  );
}
