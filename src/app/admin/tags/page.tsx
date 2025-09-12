"use client";

import { useState } from "react";
import {
  useTags,
  useDeleteTag,
  useCreateTag,
  useUpdateTag,
} from "@/hooks/useTags";
import type { TagFilters, NewTag } from "@/types";

export default function TagsAdminPage() {
  const [filters, setFilters] = useState<TagFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewTag>>({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    visible: true,
  });

  const { data: tags, isLoading, error } = useTags(filters);
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    await createTag.mutateAsync(formData as NewTag);
    setIsCreating(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      visible: true,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag || !formData.name || !formData.slug) return;

    await updateTag.mutateAsync({ id: editingTag, tag: formData });
    setEditingTag(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      visible: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      await deleteTag.mutateAsync(id);
    }
  };

  const handleEdit = (tag: any) => {
    setEditingTag(tag.id);
    setFormData(tag);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tags</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Tag
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search tags..."
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
      {(isCreating || editingTag) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isCreating ? "Create Tag" : "Edit Tag"}
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
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingTag(null);
                  setFormData({
                    name: "",
                    slug: "",
                    description: "",
                    color: "#3B82F6",
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

      {/* Tags Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tags?.map((tag) => (
            <li key={tag.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: tag.color || "#3B82F6" }}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {tag.name}
                    </h3>
                    <p className="text-sm text-gray-500">{tag.slug}</p>
                    {tag.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {tag.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tag.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tag.visible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    onClick={() => handleEdit(tag)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
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
