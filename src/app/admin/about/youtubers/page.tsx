"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import {
  useYoutubers,
  useCreateYoutuber,
  useUpdateYoutuber,
  useDeleteYoutuber,
} from "@/hooks/about/useYoutubers";
import type { Youtuber, NewYoutuber, YoutuberCategory } from "@/types";

export default function YouTubersAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedYoutuber, setSelectedYoutuber] = useState<Youtuber | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<
    YoutuberCategory | "all"
  >("all");

  // Hooks
  const { data: youtubers, isLoading, error } = useYoutubers();
  const createYoutuber = useCreateYoutuber();
  const updateYoutuber = useUpdateYoutuber();
  const deleteYoutuber = useDeleteYoutuber();

  // Form state
  const [formData, setFormData] = useState<Partial<NewYoutuber>>({
    channelName: "",
    description: "",
    category: "current",
    youtubeUrl: "",
    profileImage: "",
    subscriberCount: "",
    contentType: "",
    notes: "",
    order: 0,
    visible: true,
  });

  const categoryOptions: { value: YoutuberCategory; label: string }[] = [
    { value: "current", label: "Current" },
    { value: "childhood", label: "Childhood" },
  ];

  const filteredYoutubers =
    selectedCategory === "all"
      ? youtubers
      : youtubers?.filter(
          (youtuber) => youtuber.category === selectedCategory
        ) || [];

  const handleCreate = async () => {
    try {
      await createYoutuber.mutateAsync(formData as NewYoutuber);
      setIsCreateModalOpen(false);
      setFormData({
        channelName: "",
        description: "",
        category: "current",
        youtubeUrl: "",
        profileImage: "",
        subscriberCount: "",
        contentType: "",
        notes: "",
        order: 0,
        visible: true,
      });
    } catch (error) {
      console.error("Failed to create youtuber:", error);
    }
  };

  const handleEdit = (youtuber: Youtuber) => {
    setSelectedYoutuber(youtuber);
    setFormData({
      channelName: youtuber.channelName,
      description: youtuber.description,
      category: youtuber.category,
      youtubeUrl: youtuber.youtubeUrl,
      profileImage: youtuber.profileImage,
      subscriberCount: youtuber.subscriberCount,
      contentType: youtuber.contentType,
      notes: youtuber.notes,
      order: youtuber.order,
      visible: youtuber.visible,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedYoutuber) return;

    try {
      await updateYoutuber.mutateAsync({
        id: selectedYoutuber.id,
        youtuber: formData,
      });
      setIsEditModalOpen(false);
      setSelectedYoutuber(null);
    } catch (error) {
      console.error("Failed to update youtuber:", error);
    }
  };

  const handleDelete = (youtuber: Youtuber) => {
    setSelectedYoutuber(youtuber);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedYoutuber) return;

    try {
      await deleteYoutuber.mutateAsync(selectedYoutuber.id);
      setIsDeleteModalOpen(false);
      setSelectedYoutuber(null);
    } catch (error) {
      console.error("Failed to delete youtuber:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading youtubers</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">YouTubers</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add YouTuber
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <label className="flex items-center text-gray-700">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === "all"}
              onChange={(e) =>
                setSelectedCategory(e.target.value as YoutuberCategory | "all")
              }
              className="mr-2"
            />
            All
          </label>
          {categoryOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-gray-700"
            >
              <input
                type="radio"
                name="category"
                value={option.value}
                checked={selectedCategory === option.value}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as YoutuberCategory)
                }
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* YouTubers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredYoutubers?.map((youtuber) => (
            <li key={youtuber.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {youtuber.profileImage ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={youtuber.profileImage}
                        alt={youtuber.channelName}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">📺</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {youtuber.channelName}
                      </h3>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          youtuber.category === "current"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {
                          categoryOptions.find(
                            (c) => c.value === youtuber.category
                          )?.label
                        }
                      </span>
                    </div>
                    {youtuber.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {youtuber.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center space-x-4">
                      {youtuber.subscriberCount && (
                        <span className="text-xs text-gray-400">
                          {youtuber.subscriberCount} subscribers
                        </span>
                      )}
                      {youtuber.contentType && (
                        <span className="text-xs text-gray-400">
                          {youtuber.contentType}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Order: {youtuber.order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      youtuber.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {youtuber.visible ? "Visible" : "Hidden"}
                  </span>
                  {youtuber.youtubeUrl && (
                    <a
                      href={youtuber.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      YouTube
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(youtuber)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(youtuber)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredYoutubers?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No YouTubers found. Add some to get started!
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New YouTuber"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Channel Name *
            </label>
            <input
              type="text"
              value={formData.channelName || ""}
              onChange={(e) =>
                setFormData({ ...formData, channelName: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              value={formData.category || "current"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as YoutuberCategory,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              YouTube URL
            </label>
            <input
              type="url"
              value={formData.youtubeUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, youtubeUrl: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image URL
            </label>
            <input
              type="url"
              value={formData.profileImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, profileImage: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subscriber Count
              </label>
              <input
                type="text"
                value={formData.subscriberCount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subscriberCount: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., 1.2M, 500K"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <input
                type="text"
                value={formData.contentType || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contentType: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., Gaming, Tech, Vlogs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible || false}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="visible"
              className="ml-2 block text-sm text-gray-900"
            >
              Visible
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createYoutuber.isPending || !formData.channelName}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createYoutuber.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedYoutuber(null);
        }}
        title="Edit YouTuber"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Channel Name *
            </label>
            <input
              type="text"
              value={formData.channelName || ""}
              onChange={(e) =>
                setFormData({ ...formData, channelName: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              value={formData.category || "current"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as YoutuberCategory,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              YouTube URL
            </label>
            <input
              type="url"
              value={formData.youtubeUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, youtubeUrl: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image URL
            </label>
            <input
              type="url"
              value={formData.profileImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, profileImage: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subscriber Count
              </label>
              <input
                type="text"
                value={formData.subscriberCount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subscriberCount: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., 1.2M, 500K"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <input
                type="text"
                value={formData.contentType || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contentType: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., Gaming, Tech, Vlogs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible-edit"
              checked={formData.visible || false}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="visible-edit"
              className="ml-2 block text-sm text-gray-900"
            >
              Visible
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedYoutuber(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateYoutuber.isPending || !formData.channelName}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {updateYoutuber.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedYoutuber(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete YouTuber"
        message="Are you sure you want to delete this YouTuber? This action cannot be undone."
        itemName={selectedYoutuber?.channelName}
        isLoading={deleteYoutuber.isPending}
      />
    </div>
  );
}
