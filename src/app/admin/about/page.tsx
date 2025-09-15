"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Music,
  Tv,
  Book,
  Users,
  Gamepad2,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useAboutCore,
  useCreateAboutCore,
  useUpdateAboutCore,
  useDeleteAboutCore,
} from "@/hooks/about/useAboutCore";
import { Modal, Button } from "@/components/ui";
import { AboutCoreForm } from "@/components/pages/admin/AboutCoreForm";
import { AboutCoreList } from "@/components/pages/admin/AboutCoreList";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import type { AboutCore, NewAboutCore } from "@/types";

export default function AboutAdminPage() {
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAboutCore, setSelectedAboutCore] = useState<AboutCore | null>(
    null
  );

  const { data: aboutCoreData, isLoading, error } = useAboutCore();
  const aboutCore = aboutCoreData || null;
  const createAboutCore = useCreateAboutCore();
  const updateAboutCore = useUpdateAboutCore();
  const deleteAboutCore = useDeleteAboutCore();

  // Create about core
  const handleCreateAboutCore = async (aboutCoreData: NewAboutCore) => {
    try {
      await createAboutCore.mutateAsync(aboutCoreData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create about core:", error);
    }
  };

  // Edit about core
  const handleEditAboutCore = () => {
    if (aboutCore) {
      setSelectedAboutCore(aboutCore);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateAboutCore = async (aboutCoreData: NewAboutCore) => {
    if (!selectedAboutCore) return;

    try {
      await updateAboutCore.mutateAsync(aboutCoreData);
      setIsEditModalOpen(false);
      setSelectedAboutCore(null);
    } catch (error) {
      console.error("Failed to update about core:", error);
    }
  };

  // Delete about core
  const handleDeleteAboutCore = () => {
    if (aboutCore) {
      setSelectedAboutCore(aboutCore);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAboutCore) return;

    try {
      await deleteAboutCore.mutateAsync(selectedAboutCore.id);
      setIsDeleteModalOpen(false);
      setSelectedAboutCore(null);
    } catch (error) {
      console.error("Failed to delete about core:", error);
    }
  };

  const handleToggleVisibility = async () => {
    if (!aboutCore) return;
    try {
      await updateAboutCore.mutateAsync({
        ...aboutCore,
        visible: !aboutCore.visible,
      });
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  if (error) return <div>Error loading about information</div>;

  const aboutSections = [
    {
      name: "Music Genres",
      description: "Favorite music genres and preferences",
      href: "/admin/about/music/genres",
      icon: Music,
      color: "bg-purple-500",
    },
    {
      name: "Last Listened Songs",
      description: "Recently played tracks and music history",
      href: "/admin/about/music/songs",
      icon: Music,
      color: "bg-pink-500",
    },
    {
      name: "Anime List",
      description: "Anime you're watching, want to watch, and completed",
      href: "/admin/about/anime",
      icon: Tv,
      color: "bg-indigo-500",
    },
    {
      name: "Books",
      description: "Books you're reading, want to read, and completed",
      href: "/admin/about/books",
      icon: Book,
      color: "bg-green-500",
    },
    {
      name: "Political Views",
      description: "Political figures and views you follow",
      href: "/admin/about/politics",
      icon: Users,
      color: "bg-red-500",
    },
    {
      name: "YouTubers",
      description: "YouTubers you watch currently and from childhood",
      href: "/admin/about/youtubers",
      icon: Users,
      color: "bg-orange-500",
    },
    {
      name: "Games",
      description: "Games you play, played as a kid, and plan to play",
      href: "/admin/about/games",
      icon: Gamepad2,
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          About Management
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.open("/about", "_blank")}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Public Page
          </Button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={!!aboutCore}
          >
            {aboutCore ? "About Configured" : "Create About"}
          </button>
        </div>
      </div>

      {/* About Core List */}
      <AboutCoreList
        aboutCore={aboutCore}
        onEdit={handleEditAboutCore}
        onDelete={handleDeleteAboutCore}
        onToggleVisibility={handleToggleVisibility}
        isLoading={isLoading}
      />

      {/* About Sections Grid */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          About Sections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aboutSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.name}
                href={section.href}
                className="group flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${section.color} text-white mr-3`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {section.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {section.description}
                  </p>
                </div>
                <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Create About Core Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create About Information"
        size="lg"
      >
        <AboutCoreForm
          onSubmit={handleCreateAboutCore}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createAboutCore.isPending}
        />
      </Modal>

      {/* Edit About Core Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAboutCore(null);
        }}
        title="Edit About Information"
        size="lg"
      >
        {selectedAboutCore && (
          <AboutCoreForm
            aboutCore={selectedAboutCore}
            onSubmit={handleUpdateAboutCore}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedAboutCore(null);
            }}
            isLoading={updateAboutCore.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAboutCore(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete About Information"
        message="Are you sure you want to delete your about information? This action cannot be undone."
        itemName={selectedAboutCore?.name}
        isLoading={deleteAboutCore.isPending}
      />
    </div>
  );
}
