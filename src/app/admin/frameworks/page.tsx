"use client";

import { useState } from "react";
import {
  useFrameworks,
  useDeleteFramework,
  useCreateFramework,
  useUpdateFramework,
} from "@/hooks/useFrameworks";
import { Modal } from "@/components/ui";
import { FrameworkForm } from "@/components/pages/admin/FrameworkForm";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import type {
  FrameworkFilters,
  NewFramework,
  Framework,
  FrameworkType,
} from "@/types";

export default function FrameworksAdminPage() {
  const [filters, setFilters] = useState<FrameworkFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<FrameworkType | "all">(
    "all"
  );

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(
    null
  );

  const { data: frameworks, isLoading, error } = useFrameworks(filters);
  const createFramework = useCreateFramework();
  const updateFramework = useUpdateFramework();
  const deleteFramework = useDeleteFramework();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ...filters,
      search: searchTerm,
      type: selectedType === "all" ? undefined : selectedType,
    });
  };

  // Create framework
  const handleCreateFramework = async (frameworkData: NewFramework) => {
    try {
      await createFramework.mutateAsync(frameworkData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create framework:", error);
    }
  };

  // Edit framework
  const handleEditFramework = (framework: Framework) => {
    setSelectedFramework(framework);
    setIsEditModalOpen(true);
  };

  const handleUpdateFramework = async (frameworkData: NewFramework) => {
    if (!selectedFramework) return;

    try {
      await updateFramework.mutateAsync({
        id: selectedFramework.id,
        framework: frameworkData,
      });
      setIsEditModalOpen(false);
      setSelectedFramework(null);
    } catch (error) {
      console.error("Failed to update framework:", error);
    }
  };

  // Delete framework
  const handleDeleteFramework = (framework: Framework) => {
    setSelectedFramework(framework);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFramework) return;

    try {
      await deleteFramework.mutateAsync(selectedFramework.id);
      setIsDeleteModalOpen(false);
      setSelectedFramework(null);
    } catch (error) {
      console.error("Failed to delete framework:", error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading frameworks</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Frameworks & Languages
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Framework
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Language
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search frameworks and languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          />
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as FrameworkType | "all")
            }
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="framework">Frameworks</option>
            <option value="language">Languages</option>
          </select>
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Search
          </button>
        </form>

        <div className="flex gap-4 mt-4">
          <label className="flex items-center">
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

      {/* Frameworks & Languages Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {frameworks?.map((framework) => (
            <li key={framework.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: framework.color || "#3B82F6" }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {framework.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          framework.type === "framework"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {framework.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{framework.slug}</p>
                    {framework.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {framework.description}
                      </p>
                    )}
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-400">
                        Order: {framework.order}
                      </span>
                      {framework.version && (
                        <span className="text-xs text-gray-400">
                          v{framework.version}
                        </span>
                      )}
                      {framework.icon && (
                        <span className="text-xs text-gray-400">
                          Icon: {framework.icon}
                        </span>
                      )}
                      {framework.website && (
                        <a
                          href={framework.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      framework.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {framework.visible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    onClick={() => handleEditFramework(framework)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFramework(framework)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Framework Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Framework"
        size="md"
      >
        <FrameworkForm
          onSubmit={handleCreateFramework}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createFramework.isPending}
        />
      </Modal>

      {/* Edit Framework Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFramework(null);
        }}
        title="Edit Framework"
        size="md"
      >
        {selectedFramework && (
          <FrameworkForm
            framework={selectedFramework}
            onSubmit={handleUpdateFramework}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedFramework(null);
            }}
            isLoading={updateFramework.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFramework(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Framework"
        message="Are you sure you want to delete this framework? This action cannot be undone."
        itemName={selectedFramework?.name}
        isLoading={deleteFramework.isPending}
      />
    </div>
  );
}
