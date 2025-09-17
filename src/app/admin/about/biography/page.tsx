"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/Card";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { Save, Eye, EyeOff, Edit } from "lucide-react";
import { useBiography, useUpdateBiography } from "@/hooks/about/useBiography";
import { toast } from "sonner";

export default function BiographyAdminPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    featuredBiography: "",
    fullBiography: "",
    visible: true,
  });

  const { data: biography, isLoading } = useBiography();
  const updateBiography = useUpdateBiography();

  // Update form data when biography data loads
  useEffect(() => {
    if (biography) {
      setFormData({
        featuredBiography: biography.featuredBiography || "",
        fullBiography: biography.fullBiography || "",
        visible: biography.visible,
      });
    }
  }, [biography]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!formData.featuredBiography?.trim()) {
      toast.error("Featured biography is required");
      return;
    }

    try {
      await updateBiography.mutateAsync({
        featuredBiography: formData.featuredBiography,
        fullBiography: formData.fullBiography,
        visible: formData.visible,
      });
      setIsEditModalOpen(false);
      toast.success("Biography updated successfully");
    } catch {
      toast.error("Failed to update biography");
    }
  };

  const handleCancel = () => {
    if (biography) {
      setFormData({
        featuredBiography: biography.featuredBiography || "",
        fullBiography: biography.fullBiography || "",
        visible: biography.visible,
      });
    }
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <AdminPageLayout
        title="Biography"
        description="Manage your biography and featured biography"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Loading biography...
            </p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  const headerActions = (
    <ActionButton onClick={handleEdit}>
      <Edit className="h-4 w-4 mr-2" />
      Edit Biography
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Biography"
        description="Manage your biography and featured biography"
        headerActions={headerActions}
      >
        {/* Biography Display */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Biography
                    </h3>
                    {!biography?.visible && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {biography?.featuredBiography ||
                      "No featured biography set"}
                  </p>
                  <div className="mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Status: {biography?.visible ? "Visible" : "Hidden"}
                      {biography?.fullBiography &&
                        " • Full biography available"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`px-3 py-1 text-xs rounded-full ${
                    biography?.visible
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  }`}
                >
                  {biography?.visible ? "Visible" : "Hidden"}
                </button>
                <button
                  onClick={handleEdit}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminPageLayout>

      {/* Edit Biography Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancel}
        title="Edit Biography"
        size="lg"
      >
        <div className="space-y-6">
          {/* Featured Biography */}
          <div>
            <Label htmlFor="featuredBiography">Featured Biography</Label>
            <Textarea
              id="featuredBiography"
              value={formData.featuredBiography}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  featuredBiography: e.target.value,
                })
              }
              placeholder="Write a short biography that will be displayed on the home page..."
              rows={4}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This text will be shown in the about section on your home page.
            </p>
          </div>

          {/* Full Biography */}
          <div>
            <Label htmlFor="fullBiography">Full Biography (Markdown)</Label>
            <MarkdownEditor
              value={formData.fullBiography}
              onChange={(value) =>
                setFormData({ ...formData, fullBiography: value })
              }
              placeholder="Write your detailed biography using Markdown..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You can use Markdown formatting for rich text. This will be
              displayed on your about page.
            </p>
          </div>

          {/* Visibility Settings */}
          <div className="flex items-center space-x-2">
            <Switch
              id="visible"
              checked={formData.visible}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, visible: checked })
              }
            />
            <Label htmlFor="visible">Make biography visible to public</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleUpdate}
              disabled={updateBiography.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {updateBiography.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateBiography.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
