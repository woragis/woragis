"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui";
import type { AboutCore, NewAboutCore } from "@/types";

export default function AboutCoreAdminPage() {
  const [aboutCore, setAboutCore] = useState<AboutCore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<NewAboutCore>>({
    name: "",
    biography: "",
    featuredBiography: "",
    visible: true,
  });

  useEffect(() => {
    fetchAboutCore();
  }, []);

  const fetchAboutCore = async () => {
    try {
      const response = await fetch("/api/admin/about/core");
      const data = await response.json();
      if (data.success && data.data) {
        setAboutCore(data.data.about);
        setFormData({
          name: data.data.about.name,
          currentProfessionId: data.data.about.currentProfessionId,
          biography: data.data.about.biography,
          featuredBiography: data.data.about.featuredBiography,
          visible: data.data.about.visible,
        });
      }
    } catch (error) {
      console.error("Failed to fetch about core:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsCreating(true);
      const url = aboutCore ? "/api/admin/about/core" : "/api/admin/about/core";
      const method = aboutCore ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchAboutCore();
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to save about core:", data.error);
      }
    } catch (error) {
      console.error("Failed to save about core:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">About Core</h1>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {aboutCore ? "Edit" : "Create"} About
        </button>
      </div>

      {/* Current About Core Display */}
      {aboutCore && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {aboutCore.name}
                </h3>
                {aboutCore.biography && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Biography:
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                      {aboutCore.biography}
                    </p>
                  </div>
                )}
                {aboutCore.featuredBiography && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Featured Biography:
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {aboutCore.featuredBiography}
                    </p>
                  </div>
                )}
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  aboutCore.visible
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {aboutCore.visible ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={aboutCore ? "Edit About Core" : "Create About Core"}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Biography (Markdown)
            </label>
            <textarea
              value={formData.biography || ""}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
              rows={6}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Write your biography in markdown format..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Featured Biography (Plain Text)
            </label>
            <textarea
              value={formData.featuredBiography || ""}
              onChange={(e) =>
                setFormData({ ...formData, featuredBiography: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Short biography for home page display..."
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
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isCreating || !formData.name}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
