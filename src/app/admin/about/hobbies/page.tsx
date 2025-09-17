"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import { ActionButton } from "@/components/ui/ActionButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmationModal, HobbiesForm } from "@/components/pages/admin";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  useHobbies,
  useCreateHobby,
  useUpdateHobby,
  useDeleteHobby,
  useToggleHobbyVisibility,
} from "@/hooks/about/useHobbies";
import { Hobby, NewHobby } from "@/types/about/hobbies";
import { toast } from "sonner";

export default function HobbiesAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data: hobbies = [], isLoading, error } = useHobbies();
  const createHobby = useCreateHobby();
  const updateHobby = useUpdateHobby();
  const deleteHobby = useDeleteHobby();
  const toggleVisibility = useToggleHobbyVisibility();

  const searchedHobbies =
    hobbies?.filter(
      (item: Hobby) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create hobby
  const handleCreateHobby = async (hobbyData: NewHobby) => {
    try {
      await createHobby.mutateAsync(hobbyData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create hobby:", error);
    }
  };

  // Edit hobby
  const handleEditHobby = (hobbyItem: Hobby) => {
    setSelectedHobby(hobbyItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateHobby = async (hobbyData: NewHobby) => {
    if (!selectedHobby) return;

    try {
      await updateHobby.mutateAsync({
        id: selectedHobby.id,
        hobby: hobbyData,
      });
      setIsEditModalOpen(false);
      setSelectedHobby(null);
    } catch (error) {
      console.error("Failed to update hobby:", error);
    }
  };

  // Delete hobby
  const handleDeleteHobby = (hobbyItem: Hobby) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading hobbies</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Hobby
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Hobbies List"
        description="Manage your hobbies and interests"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search hobbies..."
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Hobbies List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedHobbies?.map((hobbyItem: Hobby) => (
              <li key={hobbyItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {hobbyItem.name}
                        </h3>
                        {!hobbyItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {hobbyItem.description || "No description"}
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Added{" "}
                          {new Date(hobbyItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(hobbyItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        hobbyItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {hobbyItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditHobby(hobbyItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteHobby(hobbyItem)}
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

      {/* Create Hobby Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Hobby"
        size="lg"
      >
        <HobbiesForm
          onSubmit={handleCreateHobby}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createHobby.isPending}
        />
      </Modal>

      {/* Edit Hobby Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHobby(null);
        }}
        title="Edit Hobby"
        size="lg"
      >
        {selectedHobby && (
          <HobbiesForm
            hobby={selectedHobby}
            onSubmit={handleUpdateHobby}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedHobby(null);
            }}
            isLoading={updateHobby.isPending}
          />
        )}
      </Modal>

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
    </>
  );
}
