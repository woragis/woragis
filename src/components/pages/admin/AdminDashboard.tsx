"use client";

import React, { useState } from "react";
import { Project } from "@/types/projects";
import { ProjectForm } from "./ProjectForm";
import { ProjectList } from "./ProjectList";
import { Button, Card } from "@/components/ui";
import { Plus, Settings, BarChart3 } from "lucide-react";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useUpdateProjectOrder,
  useToggleProjectVisibility,
  useToggleProjectFeatured,
} from "@/hooks/useProjects";
import { useSettings, useUpdateSetting } from "@/hooks/useSettings";
import { useAuth } from "@/stores/auth-store";
import type { NewProject } from "@/types/projects";

export const AdminDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Auth hook
  const { user } = useAuth();

  // TanStack Query hooks
  const { data: projects = [], isLoading } = useProjects();
  const { data: settings = [] } = useSettings();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const updateProjectOrderMutation = useUpdateProjectOrder();
  const toggleVisibilityMutation = useToggleProjectVisibility();
  const toggleFeaturedMutation = useToggleProjectFeatured();
  const updateSettingMutation = useUpdateSetting();

  // Get projects per page setting
  const projectsPerPageSetting = settings.find(
    (s) => s.key === "projects_per_page"
  );
  const projectsPerPage = projectsPerPageSetting
    ? parseInt(projectsPerPageSetting.value)
    : 6;

  // Create or update project
  const handleSaveProject = async (projectData: NewProject) => {
    try {
      if (editingProject) {
        // For updates, we can pass the full project data
        await updateProjectMutation.mutateAsync({
          id: editingProject.id.toString(),
          project: projectData,
        });
      } else {
        // Ensure userId is included for new projects
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        await createProjectMutation.mutateAsync(projectData);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProjectMutation.mutateAsync(id.toString());
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Toggle project visibility
  const handleToggleVisibility = async (id: number) => {
    try {
      await toggleVisibilityMutation.mutateAsync(id.toString());
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  // Toggle project featured status
  const handleToggleFeatured = async (id: number) => {
    try {
      await toggleFeaturedMutation.mutateAsync(id.toString());
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  // Reorder projects
  const handleReorderProjects = async (
    projectOrders: { id: number; order: number }[]
  ) => {
    try {
      const formattedOrders = projectOrders.map((order) => ({
        id: order.id.toString(),
        order: order.order,
      }));
      await updateProjectOrderMutation.mutateAsync(formattedOrders);
    } catch (error) {
      console.error("Error reordering projects:", error);
    }
  };

  // Update projects per page
  const handleUpdateProjectsPerPage = async (count: number) => {
    try {
      await updateSettingMutation.mutateAsync({
        key: "projects_per_page",
        value: count.toString(),
      });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  // Edit project
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const stats = {
    total: projects.length,
    visible: projects.filter((p) => p.visible).length,
    featured: projects.filter((p) => p.featured).length,
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your portfolio projects and settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Visible Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.visible}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Plus className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Featured Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.featured}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Settings
        </h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Projects per page on home:
          </label>
          <select
            value={projectsPerPage}
            onChange={(e) =>
              handleUpdateProjectsPerPage(parseInt(e.target.value))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {[3, 6, 9, 12].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Projects Management */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Projects Management
          </h2>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Button>
        </div>

        {showForm && (
          <div className="mb-6">
            <ProjectForm
              project={editingProject || undefined}
              userId={user?.id || ""}
              onSubmit={handleSaveProject}
              onCancel={handleCancelForm}
              isLoading={
                createProjectMutation.isPending ||
                updateProjectMutation.isPending
              }
            />
          </div>
        )}

        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onToggleVisibility={handleToggleVisibility}
          onToggleFeatured={handleToggleFeatured}
          onReorder={handleReorderProjects}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
