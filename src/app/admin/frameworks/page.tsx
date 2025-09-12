"use client";

import { useState } from "react";
import {
  useFrameworks,
  useDeleteFramework,
  useCreateFramework,
  useUpdateFramework,
} from "@/hooks/useFrameworks";
import type { FrameworkFilters, NewFramework } from "@/types";

export default function FrameworksAdminPage() {
  const [filters, setFilters] = useState<FrameworkFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingFramework, setEditingFramework] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewFramework>>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    website: "",
    version: "",
    order: 0,
    visible: true,
  });

  const { data: frameworks, isLoading, error } = useFrameworks(filters);
  const createFramework = useCreateFramework();
  const updateFramework = useUpdateFramework();
  const deleteFramework = useDeleteFramework();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    await createFramework.mutateAsync(formData as NewFramework);
    setIsCreating(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      website: "",
      version: "",
      order: 0,
      visible: true,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFramework || !formData.name || !formData.slug) return;

    await updateFramework.mutateAsync({
      id: editingFramework,
      framework: formData,
    });
    setEditingFramework(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      website: "",
      version: "",
      order: 0,
      visible: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this framework?")) {
      await deleteFramework.mutateAsync(id);
    }
  };

  const handleEdit = (framework: any) => {
    setEditingFramework(framework.id);
    setFormData(framework);
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
        <h1 className="text-2xl font-bold text-gray-900">Frameworks</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Framework
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search frameworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          />
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

      {/* Create/Edit Form */}
      {(isCreating || editingFramework) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isCreating ? "Create Framework" : "Edit Framework"}
          </h2>
          <form
            onSubmit={isCreating ? handleCreate : handleUpdate}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="Icon name or URL"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="1.0.0"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color || "#3B82F6"}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="mt-1 block w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.visible || false}
                  onChange={(e) =>
                    setFormData({ ...formData, visible: e.target.checked })
                  }
                  className="mr-2"
                />
                Visible
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingFramework(null);
                  setFormData({
                    name: "",
                    slug: "",
                    description: "",
                    icon: "",
                    color: "#3B82F6",
                    website: "",
                    version: "",
                    order: 0,
                    visible: true,
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {isCreating ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Frameworks Table */}
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
                    <h3 className="text-sm font-medium text-gray-900">
                      {framework.name}
                    </h3>
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
                    onClick={() => handleEdit(framework)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(framework.id)}
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
    </div>
  );
}
