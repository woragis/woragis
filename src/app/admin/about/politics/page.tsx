"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import {
  usePoliticalViews,
  useCreatePoliticalView,
  useUpdatePoliticalView,
  useDeletePoliticalView,
} from "@/hooks/about/usePolitics";
import type { PoliticalView, NewPoliticalView } from "@/types";

export default function PoliticsAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPoliticalView, setSelectedPoliticalView] =
    useState<PoliticalView | null>(null);

  // Hooks
  const { data: politicalViews, isLoading, error } = usePoliticalViews();
  const createPoliticalView = useCreatePoliticalView();
  const updatePoliticalView = useUpdatePoliticalView();
  const deletePoliticalView = useDeletePoliticalView();

  // Form state
  const [formData, setFormData] = useState<Partial<NewPoliticalView>>({
    personName: "",
    description: "",
    website: "",
    socialMedia: "",
    picture: "",
    politicalParty: "",
    position: "",
    notes: "",
    order: 0,
    visible: true,
  });

  const handleCreate = async () => {
    try {
      await createPoliticalView.mutateAsync(formData as NewPoliticalView);
      setIsCreateModalOpen(false);
      setFormData({
        personName: "",
        description: "",
        website: "",
        socialMedia: "",
        picture: "",
        politicalParty: "",
        position: "",
        notes: "",
        order: 0,
        visible: true,
      });
    } catch (error) {
      console.error("Failed to create political view:", error);
    }
  };

  const handleEdit = (politicalView: PoliticalView) => {
    setSelectedPoliticalView(politicalView);
    setFormData({
      personName: politicalView.personName,
      description: politicalView.description,
      website: politicalView.website,
      socialMedia: politicalView.socialMedia
        ? JSON.parse(politicalView.socialMedia)
        : {},
      picture: politicalView.picture,
      politicalParty: politicalView.politicalParty,
      position: politicalView.position,
      notes: politicalView.notes,
      order: politicalView.order,
      visible: politicalView.visible,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedPoliticalView) return;

    try {
      await updatePoliticalView.mutateAsync({
        id: selectedPoliticalView.id,
        politicalView: formData,
      });
      setIsEditModalOpen(false);
      setSelectedPoliticalView(null);
    } catch (error) {
      console.error("Failed to update political view:", error);
    }
  };

  const handleDelete = (politicalView: PoliticalView) => {
    setSelectedPoliticalView(politicalView);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPoliticalView) return;

    try {
      await deletePoliticalView.mutateAsync(selectedPoliticalView.id);
      setIsDeleteModalOpen(false);
      setSelectedPoliticalView(null);
    } catch (error) {
      console.error("Failed to delete political view:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading political views</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Political Views</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Political View
        </button>
      </div>

      {/* Political Views Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {politicalViews?.map((politicalView) => (
            <li key={politicalView.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {politicalView.picture ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={politicalView.picture}
                        alt={politicalView.personName}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {politicalView.personName}
                      </h3>
                      {politicalView.politicalParty && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({politicalView.politicalParty})
                        </span>
                      )}
                    </div>
                    {politicalView.position && (
                      <p className="text-sm text-gray-500 mt-1">
                        {politicalView.position}
                      </p>
                    )}
                    {politicalView.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {politicalView.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-400">
                        Order: {politicalView.order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      politicalView.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {politicalView.visible ? "Visible" : "Hidden"}
                  </span>
                  {politicalView.website && (
                    <a
                      href={politicalView.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Website
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(politicalView)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(politicalView)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {politicalViews?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No political views found. Add some to get started!
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Political View"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Person Name *
            </label>
            <input
              type="text"
              value={formData.personName || ""}
              onChange={(e) =>
                setFormData({ ...formData, personName: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Political Party
            </label>
            <input
              type="text"
              value={formData.politicalParty || ""}
              onChange={(e) =>
                setFormData({ ...formData, politicalParty: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position/Role
            </label>
            <input
              type="text"
              value={formData.position || ""}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
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
              Website URL
            </label>
            <input
              type="url"
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Picture URL
            </label>
            <input
              type="url"
              value={formData.picture || ""}
              onChange={(e) =>
                setFormData({ ...formData, picture: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
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
              disabled={createPoliticalView.isPending || !formData.personName}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createPoliticalView.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPoliticalView(null);
        }}
        title="Edit Political View"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Person Name *
            </label>
            <input
              type="text"
              value={formData.personName || ""}
              onChange={(e) =>
                setFormData({ ...formData, personName: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Political Party
            </label>
            <input
              type="text"
              value={formData.politicalParty || ""}
              onChange={(e) =>
                setFormData({ ...formData, politicalParty: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position/Role
            </label>
            <input
              type="text"
              value={formData.position || ""}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
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
              Website URL
            </label>
            <input
              type="url"
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Picture URL
            </label>
            <input
              type="url"
              value={formData.picture || ""}
              onChange={(e) =>
                setFormData({ ...formData, picture: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
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
                setSelectedPoliticalView(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={updatePoliticalView.isPending || !formData.personName}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {updatePoliticalView.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPoliticalView(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Political View"
        message="Are you sure you want to delete this political view? This action cannot be undone."
        itemName={selectedPoliticalView?.personName}
        isLoading={deletePoliticalView.isPending}
      />
    </div>
  );
}
