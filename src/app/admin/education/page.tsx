"use client";

import React, { useState, useCallback } from "react";
import {
  useEducation,
  useDeleteEducation,
  useCreateEducation,
  useUpdateEducation,
} from "@/hooks/useEducation";
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
import { EducationForm } from "@/components/pages/admin/education/EducationForm";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  GraduationCap,
  Building2,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import type {
  EducationFilters,
  NewEducation,
  Education,
  EducationType,
  DegreeLevel,
} from "@/types/education";
import type { AdminListItem } from "@/components/ui/admin/AdminList";
import type { AdminGridItem } from "@/components/ui/admin/AdminGrid";
import { useDisplay } from "@/contexts/DisplayContext";

export default function EducationAdminPage() {
  const [filters, setFilters] = useState<EducationFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { displayMode } = useDisplay();
  const { t } = useLanguage();
  const { data: educationData = [], isLoading, error } = useEducation(filters);
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create education
  const handleCreateEducation = useCallback(async (educationData: any) => {
    try {
      await createEducation.mutateAsync(educationData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create education:", error);
    }
  }, [createEducation]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateEducation(createFormData);
    }
  }, [createFormData, handleCreateEducation]);

  // Edit education
  const handleEditEducation = (education: Education) => {
    setSelectedEducation(education);
    setIsEditModalOpen(true);
  };

  const handleUpdateEducation = useCallback(async (educationData: any) => {
    if (!selectedEducation) return;

    try {
      await updateEducation.mutateAsync({
        id: selectedEducation.id,
        education: educationData,
      });
      setIsEditModalOpen(false);
      setSelectedEducation(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update education:", error);
    }
  }, [selectedEducation, updateEducation]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedEducation) {
      handleUpdateEducation(editFormData);
    }
  }, [editFormData, selectedEducation, handleUpdateEducation]);

  // Delete education
  const handleDelete = (education: Education) => {
    setSelectedEducation(education);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEducation) return;

    try {
      await deleteEducation.mutateAsync(selectedEducation.id);
      setIsDeleteModalOpen(false);
      setSelectedEducation(null);
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("admin.education.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t("admin.education.subtitle")}
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
            title="Unable to Load Education"
            description="There was an error loading the education records. Please try again later."
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
            {t("admin.education.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            {t("admin.education.subtitle")}
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder={t("admin.education.searchPlaceholder")}
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
                  type: e.target.value ? (e.target.value as EducationType) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">{t("admin.education.allTypes")}</option>
              <option value="degree">{t("admin.education.types.degree")}</option>
              <option value="certificate">{t("admin.education.types.certificate")}</option>
            </select>
            <select
              value={filters.degreeLevel || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  degreeLevel: e.target.value ? (e.target.value as DegreeLevel) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">{t("admin.education.allDegreeLevels")}</option>
              <option value="bachelor">{t("admin.education.degreeLevels.bachelor")}</option>
              <option value="master">{t("admin.education.degreeLevels.master")}</option>
              <option value="doctorate">{t("admin.education.degreeLevels.doctorate")}</option>
              <option value="associate">{t("admin.education.degreeLevels.associate")}</option>
              <option value="diploma">{t("admin.education.degreeLevels.diploma")}</option>
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
              <option value="">{t("admin.education.allVisibility")}</option>
              <option value="true">{t("admin.education.visibility.visible")}</option>
              <option value="false">{t("admin.education.visibility.hidden")}</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              {t("common.search")}
            </Button>
            <DisplayToggle />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t("admin.education.addEducation")}
            </Button>
          </form>
        </Card>

        {/* Education Display */}
        {educationData.length === 0 ? (
          <EmptyState
            title={t("admin.education.noEducationFound")}
            description={t("admin.education.noEducationDescription")}
            actionLabel={t("admin.education.addEducation")}
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : displayMode === "grid" ? (
          <AdminGrid
            items={educationData.map((education: Education): AdminGridItem => ({
              id: education.id,
              title: education.title,
              description: education.institution,
              icon: education.type === "degree" ? "🎓" : "📜",
              iconBg: education.type === "degree" ? "#3B82F6" : "#10B981",
              badges: [
                { 
                  label: education.type, 
                  variant: education.type === "degree" ? "info" as const : "success" as const 
                },
                ...(education.degreeLevel ? [{ 
                  label: education.degreeLevel, 
                  variant: "default" as const 
                }] : []),
                ...(education.pdfDocument ? [{ 
                  label: "PDF", 
                  variant: "warning" as const 
                }] : []),
                ...(education.visible ? [] : [{ label: "Hidden", variant: "error" as const }])
              ],
              metadata: [
                { label: "Institution", value: education.institution },
                { label: "Order", value: education.order?.toString() || "0" },
                ...(education.fieldOfStudy ? [{ label: "Field", value: education.fieldOfStudy }] : []),
                ...(education.grade ? [{ label: "Grade", value: education.grade }] : []),
                ...(education.completionDate ? [{ 
                  label: "Completed", 
                  value: new Date(education.completionDate).toLocaleDateString() 
                }] : [])
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditEducation(education),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(education),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No education records found"
            emptyAction={{
              label: "Add Education",
              onClick: () => setIsCreateModalOpen(true)
            }}
            columns={3}
          />
        ) : (
          <AdminList
            items={educationData.map((education: Education): AdminListItem => ({
              id: education.id,
              title: education.title,
              description: education.institution,
              badges: [
                { 
                  label: education.type, 
                  variant: education.type === "degree" ? "info" as const : "success" as const 
                },
                ...(education.degreeLevel ? [{ 
                  label: education.degreeLevel, 
                  variant: "default" as const 
                }] : []),
                ...(education.pdfDocument ? [{ 
                  label: "PDF", 
                  variant: "warning" as const 
                }] : []),
                ...(education.visible ? [] : [{ label: "Hidden", variant: "error" as const }])
              ],
              metadata: [
                { label: "Institution", value: education.institution },
                { label: "Order", value: education.order?.toString() || "0" },
                ...(education.fieldOfStudy ? [{ label: "Field", value: education.fieldOfStudy }] : []),
                ...(education.grade ? [{ label: "Grade", value: education.grade }] : []),
                ...(education.completionDate ? [{ 
                  label: "Completed", 
                  value: new Date(education.completionDate).toLocaleDateString() 
                }] : [])
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditEducation(education),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(education),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No education records found"
            emptyAction={{
              label: "Add Education",
              onClick: () => setIsCreateModalOpen(true)
            }}
          />
        )}

        {/* Create Education Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Education"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createEducation.isPending}
          maxHeight="90vh"
        >
          <EducationForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createEducation.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Education Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEducation(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Education"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedEducation(null);
            setEditFormData(null);
          }}
          isLoading={updateEducation.isPending}
          maxHeight="90vh"
        >
          {selectedEducation && (
            <EducationForm
              education={selectedEducation}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedEducation(null);
              }}
              isLoading={updateEducation.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedEducation(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Education"
          message="Are you sure you want to delete this education record? This action cannot be undone."
          itemName={selectedEducation?.title}
          isLoading={deleteEducation.isPending}
        />
      </Container>
    </div>
  );
}
