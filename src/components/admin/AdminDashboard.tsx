"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/server/db/schema";
import { ProjectForm } from "./ProjectForm";
import { ProjectList } from "./ProjectList";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Plus, Settings, BarChart3 } from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectsPerPage, setProjectsPerPage] = useState(6);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      setProjectsPerPage(data.projectsPerPage || 6);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSettings();
  }, []);

  // Create or update project
  const handleSaveProject = async (projectData: Partial<Project>) => {
    setIsSaving(true);
    try {
      const url = editingProject
        ? "/api/admin/projects"
        : "/api/admin/projects";

      const method = editingProject ? "PUT" : "POST";
      const body = editingProject
        ? { action: "update", id: editingProject.id, ...projectData }
        : projectData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchProjects();
        setShowForm(false);
        setEditingProject(null);
      } else {
        console.error("Error saving project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        console.error("Error deleting project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Toggle project visibility
  const handleToggleVisibility = async (id: number) => {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-visibility", id }),
      });

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  // Toggle project featured status
  const handleToggleFeatured = async (id: number) => {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-featured", id }),
      });

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  // Reorder projects
  const handleReorderProjects = async (
    projectOrders: { id: number; order: number }[]
  ) => {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", projectOrders }),
      });

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error reordering projects:", error);
    }
  };

  // Update projects per page
  const handleUpdateProjectsPerPage = async (count: number) => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "projects_per_page", value: count }),
      });

      if (response.ok) {
        setProjectsPerPage(count);
      }
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
              project={editingProject}
              onSave={handleSaveProject}
              onCancel={handleCancelForm}
              isLoading={isSaving}
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
