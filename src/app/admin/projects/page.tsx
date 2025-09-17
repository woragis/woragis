"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useProjects,
  useDeleteProject,
  useCreateProject,
  useUpdateProject,
  useToggleProjectVisibility,
  useToggleProjectFeatured,
} from "@/hooks/useProjects";
import { Modal, Button } from "@/components/ui";
import { ProjectForm } from "@/components/pages/admin/ProjectForm";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { Tag } from "lucide-react";
import type { ProjectFilters, Project, NewProject } from "@/types";

export default function ProjectsAdminPage() {
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
  const handleCreateProject = async (projectData: NewProject) => {
    try {
      await createProject.mutateAsync(projectData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  // Edit project
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (projectData: NewProject) => {
    if (!selectedProject) return;

    try {
      await updateProject.mutateAsync({
        id: selectedProject.id,
        project: projectData,
      });
      setIsEditModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.open("/admin/projects/tags", "_blank")}
            className="flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Manage Tags
          </Button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Search
          </button>
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
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {projects?.map((project) => (
            <li key={project.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-lg object-cover"
                      src={project.image}
                      alt={project.title}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                          Featured
                        </span>
                      )}
                      {!project.visible && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.description}
                    </p>
                    <div className="mt-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Technologies: {project.technologies}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleVisibility(project.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      project.visible
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {project.visible ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(project.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      project.featured
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {project.featured ? "Featured" : "Not Featured"}
                  </button>
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
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

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createProject.isPending}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        title="Edit Project"
        size="lg"
      >
        {selectedProject && (
          <ProjectForm
            project={selectedProject}
            onSubmit={handleUpdateProject}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
            isLoading={updateProject.isPending}
          />
        )}
      </Modal>

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
    </div>
  );
}
