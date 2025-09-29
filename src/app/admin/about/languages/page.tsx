"use client";

import React, { useState, useCallback } from "react";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import {
  DeleteConfirmationModal,
  LanguagesForm,
} from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Languages,
  Eye,
  EyeOff,
  Calendar,
  Hash,
} from "lucide-react";
import {
  useLanguages,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
  useToggleLanguageVisibility,
} from "@/hooks/about/useLanguages";
import { Language, NewLanguage, Proficiency } from "@/types/about/languages";

export default function LanguagesAdminPage() {
  const [filters, setFilters] = useState<{ search?: string; proficiency?: Proficiency }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: languages = [], isLoading, error } = useLanguages();
  const createLanguage = useCreateLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();
  const toggleVisibility = useToggleLanguageVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create language
  const handleCreateLanguage = useCallback(async (languageData: any) => {
    try {
      await createLanguage.mutateAsync(languageData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create language:", error);
    }
  }, [createLanguage]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateLanguage(createFormData);
    }
  }, [createFormData, handleCreateLanguage]);

  // Edit language
  const handleEditLanguage = (languageItem: Language) => {
    setSelectedLanguage(languageItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateLanguage = useCallback(async (languageData: any) => {
    if (!selectedLanguage) return;

    try {
      await updateLanguage.mutateAsync({
        id: selectedLanguage.id,
        language: languageData,
      });
      setIsEditModalOpen(false);
      setSelectedLanguage(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  }, [selectedLanguage, updateLanguage]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedLanguage) {
      handleUpdateLanguage(editFormData);
    }
  }, [editFormData, selectedLanguage, handleUpdateLanguage]);

  // Delete language
  const handleDelete = (languageItem: Language) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Languages
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your spoken languages and proficiency
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
            title="Unable to Load Languages"
            description="There was an error loading the languages. Please try again later."
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
            Languages
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your spoken languages and proficiency
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search languages..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.proficiency || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  proficiency: e.target.value ? (e.target.value as Proficiency) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Proficiency</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="native">Native</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </form>
        </Card>

        {/* Languages Grid */}
        {languages.length === 0 ? (
          <EmptyState
            title="No Languages Found"
            description="No languages match your current filters. Try adjusting your search criteria or add a new language."
            actionLabel="Add Language"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {languages.map((language) => (
              <Card key={language.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        <Languages className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {language.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Language
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditLanguage(language)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(language)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Proficiency Level Badge */}
                  <div className="mb-4">
                    <Badge
                      className={getProficiencyColor(
                        language.proficiencyLevel || "beginner"
                      )}
                    >
                      {getProficiencyLabel(
                        language.proficiencyLevel || "beginner"
                      )}
                    </Badge>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {new Date(language.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {language.visible ? (
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

        {/* Create Language Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Language"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createLanguage.isPending}
          maxHeight="90vh"
        >
          <LanguagesForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createLanguage.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Language Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLanguage(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Language"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedLanguage(null);
            setEditFormData(null);
          }}
          isLoading={updateLanguage.isPending}
          maxHeight="90vh"
        >
          {selectedLanguage && (
            <LanguagesForm
              language={selectedLanguage}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedLanguage(null);
              }}
              isLoading={updateLanguage.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

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
      </Container>
    </div>
  );
}
