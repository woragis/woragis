"use client";

import { useState } from "react";
import {
  useCategories,
  useDeleteCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import type { CategoryFilters, NewCategory } from "@/types";

export default function CategoriesAdminPage() {
  const [filters, setFilters] = useState<CategoryFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewCategory>>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    order: 0,
    visible: true,
    public: true,
  });

  const { data: categories, isLoading, error } = useCategories(filters);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    await createCategory.mutateAsync(formData as NewCategory);
    setIsCreating(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      order: 0,
      visible: true,
      public: true,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formData.name || !formData.slug) return;

    await updateCategory.mutateAsync({
      id: editingCategory,
      category: formData,
    });
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      order: 0,
      visible: true,
      public: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory.mutateAsync(id);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category.id);
    setFormData(category);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search categories..."
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
      {(isCreating || editingCategory) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isCreating ? "Create Category" : "Edit Category"}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="flex items-center space-x-6">
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.public ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, public: e.target.checked })
                  }
                  className="mr-2"
                />
                Public
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingCategory(null);
                  setFormData({
                    name: "",
                    slug: "",
                    description: "",
                    icon: "",
                    color: "#3B82F6",
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

      {/* Categories Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories?.map((category) => (
            <li key={category.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color || "#3B82F6" }}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-400">
                        Order: {category.order}
                      </span>
                      {category.icon && (
                        <span className="text-xs text-gray-400">
                          Icon: {category.icon}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.visible ? "Visible" : "Hidden"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.public
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.public ? "Public" : "Private"}
                  </span>
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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
