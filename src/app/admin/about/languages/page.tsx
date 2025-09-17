"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  DeleteConfirmationModal,
  LanguagesForm,
} from "@/components/pages/admin";
import { Badge } from "@/components/ui/badge";
import { Languages, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  useLanguages,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
  useToggleLanguageVisibility,
} from "@/hooks/about/useLanguages";
import { Language, NewLanguage, Proficiency } from "@/types/about/languages";
import { toast } from "sonner";

export default function LanguagesAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data: languages = [], isLoading, error } = useLanguages();
  const createLanguage = useCreateLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();
  const toggleVisibility = useToggleLanguageVisibility();

  const searchedLanguages =
    languages?.filter((item: Language) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create language
  const handleCreateLanguage = async (languageData: NewLanguage) => {
    try {
      await createLanguage.mutateAsync(languageData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create language:", error);
    }
  };

  // Edit language
  const handleEditLanguage = (languageItem: Language) => {
    setSelectedLanguage(languageItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateLanguage = async (languageData: NewLanguage) => {
    if (!selectedLanguage) return;

    try {
      await updateLanguage.mutateAsync({
        id: selectedLanguage.id,
        language: languageData,
      });
      setIsEditModalOpen(false);
      setSelectedLanguage(null);
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  };

  // Delete language
  const handleDeleteLanguage = (languageItem: Language) => {
    setSelectedLanguage(languageItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLanguage) return;

    try {
      await deleteLanguage.mutateAsync(selectedLanguage.id);
      setIsDeleteModalOpen(false);
      setSelectedLanguage(null);
    } catch (error) {
      console.error("Failed to delete language:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  const getProficiencyColor = (proficiency: Proficiency) => {
    switch (proficiency) {
      case "native":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "advanced":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "beginner":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getProficiencyLabel = (proficiency: Proficiency) => {
    switch (proficiency) {
      case "native":
        return "Native";
      case "advanced":
        return "Advanced";
      case "intermediate":
        return "Intermediate";
      case "beginner":
        return "Beginner";
      default:
        return proficiency;
    }
  };

  if (error) return <div>Error loading languages</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Language
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Languages List"
        description="Manage your spoken languages and proficiency"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search languages..."
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Languages List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedLanguages?.map((languageItem: Language) => (
              <li key={languageItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <Languages className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {languageItem.name}
                        </h3>
                        <Badge
                          className={getProficiencyColor(
                            languageItem.proficiencyLevel || "beginner"
                          )}
                        >
                          {getProficiencyLabel(
                            languageItem.proficiencyLevel || "beginner"
                          )}
                        </Badge>
                        {!languageItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Added{" "}
                          {new Date(
                            languageItem.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(languageItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        languageItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {languageItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditLanguage(languageItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLanguage(languageItem)}
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

      {/* Create Language Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Language"
        size="lg"
      >
        <LanguagesForm
          onSubmit={handleCreateLanguage}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createLanguage.isPending}
        />
      </Modal>

      {/* Edit Language Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLanguage(null);
        }}
        title="Edit Language"
        size="lg"
      >
        {selectedLanguage && (
          <LanguagesForm
            language={selectedLanguage}
            onSubmit={handleUpdateLanguage}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedLanguage(null);
            }}
            isLoading={updateLanguage.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLanguage(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Language"
        message="Are you sure you want to delete this language? This action cannot be undone."
        itemName={selectedLanguage?.name}
        isLoading={deleteLanguage.isPending}
      />
    </>
  );
}
