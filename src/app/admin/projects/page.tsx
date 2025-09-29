"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
  DisplayToggle,
} from "@/components/ui";
import {
  useProjects,
  useDeleteProject,
  useCreateProject,
  useUpdateProject,
  useToggleProjectVisibility,
  useToggleProjectFeatured,
} from "@/hooks/useProjects";
import { ProjectForm } from "@/components/pages/admin/projects";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import { useDisplay } from "@/contexts/DisplayContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Code,
  Eye,
  EyeOff,
  Calendar,
  Hash,
  Star,
  StarOff,
} from "lucide-react";
import type { ProjectFilters, Project, NewProject } from "@/types";

export default function ProjectsAdminPage() {
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { displayMode } = useDisplay();
  const { data: projects, isLoading, error } = useProjects(filters);
  const deleteProject = useDeleteProject();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const toggleVisibility = useToggleProjectVisibility();
  const toggleFeatured = useToggleProjectFeatured();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  // Create project
  const handleCreateProject = useCallback(async (projectData: NewProject) => {
    try {
      await createProject.mutateAsync(projectData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  }, [createProject]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateProject(createFormData);
    }
  }, [createFormData]);

  // Edit project
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = useCallback(async (projectData: NewProject) => {
    if (!selectedProject) return;

    try {
      await updateProject.mutateAsync({
        id: selectedProject.id,
        project: projectData,
      });
      setIsEditModalOpen(false);
      setSelectedProject(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  }, [selectedProject, updateProject]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedProject) {
      handleUpdateProject(editFormData);
    }
  }, [editFormData, selectedProject]);

  // Delete project
  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;

    try {
      await deleteProject.mutateAsync(selectedProject.id);
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  const handleToggleFeatured = async (id: string) => {
    await toggleFeatured.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your portfolio projects and showcase your work
            </p>
          </div>

          {/* Search and Filter Skeleton */}
          <Card className="p-6 mb-8 animate-pulse">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Card>

          {/* Projects Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-24"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
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
            title="Unable to Load Projects"
            description="There was an error loading the projects. Please try again later."
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
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your portfolio projects and showcase your work
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <DisplayToggle />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </form>

          <div className="flex gap-4 mt-4">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={filters.featured === true}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    featured: e.target.checked ? true : undefined,
                  })
                }
                className="mr-2"
              />
              Featured only
            </label>
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={filters.visible === true}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    visible: e.target.checked ? true : undefined,
                  })
                }
                className="mr-2"
              />
              Visible only
            </label>
          </div>
        </Card>

        {/* Projects Display */}
        {projects?.length === 0 ? (
          <EmptyState
            title="No Projects Found"
            description="No projects match your current filters. Try adjusting your search criteria or add a new project."
            actionLabel="Add Project"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : displayMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project) => (
              <Card key={project.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Image
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                        src={project.image}
                        alt={project.title}
                        width={48}
                        height={48}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Project
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProject(project)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Code className="w-4 h-4 mr-1" />
                        {project.technologies.slice(0, 3).join(", ")}
                        {project.technologies.length > 3 && "..."}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {project.featured ? (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                        <Star className="w-3 h-3 inline mr-1" />
                        Featured
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        <StarOff className="w-3 h-3 inline mr-1" />
                        Not Featured
                      </span>
                    )}
                    {project.visible ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        <Eye className="w-3 h-3 inline mr-1" />
                        Visible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        <EyeOff className="w-3 h-3 inline mr-1" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {projects?.map((project) => (
              <Card key={project.id} hover>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="w-10 h-10 rounded-lg object-cover"
                        src={project.image}
                        alt={project.title}
                        width={40}
                        height={40}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {project.title}
                          </h3>
                          {project.featured && (
                            <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                              <Star className="w-3 h-3 inline mr-1" />
                              Featured
                            </span>
                          )}
                          {!project.visible && (
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                              <EyeOff className="w-3 h-3 inline mr-1" />
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex items-center">
                              <Code className="w-3 h-3 mr-1" />
                              {project.technologies.slice(0, 2).join(", ")}
                              {project.technologies.length > 2 && "..."}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project)}
                        className="p-1.5"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProject(project)}
                        className="text-red-600 hover:text-red-700 p-1.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      {/* Create Project Modal */}
      <CreateEditModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateFormData(null);
        }}
        isEdit={false}
        itemName="Project"
        size="xl"
        onSubmit={handleCreateSubmit}
        onCancel={() => {
          setIsCreateModalOpen(false);
          setCreateFormData(null);
        }}
        isLoading={createProject.isPending}
        maxHeight="95vh"
      >
        <ProjectForm
          userId={user?.id || ""}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createProject.isPending}
          onFormDataChange={setCreateFormData}
        />
      </CreateEditModal>

      {/* Edit Project Modal */}
      <CreateEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
          setEditFormData(null);
        }}
        isEdit={true}
        itemName="Project"
        size="xl"
        onSubmit={handleEditSubmit}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
          setEditFormData(null);
        }}
        isLoading={updateProject.isPending}
        maxHeight="95vh"
      >
        {selectedProject && (
          <ProjectForm
            project={selectedProject}
            userId={user?.id || ""}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
            isLoading={updateProject.isPending}
            onFormDataChange={setEditFormData}
          />
        )}
      </CreateEditModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={selectedProject?.title}
        isLoading={deleteProject.isPending}
      />
      </Container>
    </div>
  );
}
