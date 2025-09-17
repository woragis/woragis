"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  DeleteConfirmationModal,
  InstrumentsForm,
} from "@/components/pages/admin";
import { Badge } from "@/components/ui/badge";
import { Music, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  useInstruments,
  useCreateInstrument,
  useUpdateInstrument,
  useDeleteInstrument,
  useToggleInstrumentVisibility,
} from "@/hooks/about/useInstruments";
import {
  Instrument,
  NewInstrument,
  KnowledgeLevel,
} from "@/types/about/instruments";
import { toast } from "sonner";

export default function InstrumentsAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data: instruments = [], isLoading, error } = useInstruments();
  const createInstrument = useCreateInstrument();
  const updateInstrument = useUpdateInstrument();
  const deleteInstrument = useDeleteInstrument();
  const toggleVisibility = useToggleInstrumentVisibility();

  const searchedInstruments =
    instruments?.filter((item: Instrument) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create instrument
  const handleCreateInstrument = async (instrumentData: NewInstrument) => {
    try {
      await createInstrument.mutateAsync(instrumentData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create instrument:", error);
    }
  };

  // Edit instrument
  const handleEditInstrument = (instrumentItem: Instrument) => {
    setSelectedInstrument(instrumentItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateInstrument = async (instrumentData: NewInstrument) => {
    if (!selectedInstrument) return;

    try {
      await updateInstrument.mutateAsync({
        id: selectedInstrument.id,
        instrument: instrumentData,
      });
      setIsEditModalOpen(false);
      setSelectedInstrument(null);
    } catch (error) {
      console.error("Failed to update instrument:", error);
    }
  };

  // Delete instrument
  const handleDeleteInstrument = (instrumentItem: Instrument) => {
    setSelectedInstrument(instrumentItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedInstrument) return;

    try {
      await deleteInstrument.mutateAsync(selectedInstrument.id);
      setIsDeleteModalOpen(false);
      setSelectedInstrument(null);
    } catch (error) {
      console.error("Failed to delete instrument:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  const getKnowledgeLevelColor = (level: KnowledgeLevel) => {
    switch (level) {
      case "expert":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "beginner":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getKnowledgeLevelLabel = (level: KnowledgeLevel) => {
    switch (level) {
      case "expert":
        return "Expert";
      case "advanced":
        return "Advanced";
      case "intermediate":
        return "Intermediate";
      case "beginner":
        return "Beginner";
      default:
        return level;
    }
  };

  if (error) return <div>Error loading instruments</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Instrument
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Instruments List"
        description="Manage your musical instruments and learning progress"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search instruments..."
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Instruments List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedInstruments?.map((instrumentItem: Instrument) => (
              <li key={instrumentItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {instrumentItem.name}
                        </h3>
                        <Badge
                          className={getKnowledgeLevelColor(
                            instrumentItem.knowledgeLevel || "beginner"
                          )}
                        >
                          {getKnowledgeLevelLabel(
                            instrumentItem.knowledgeLevel || "beginner"
                          )}
                        </Badge>
                        {!instrumentItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Added{" "}
                          {new Date(
                            instrumentItem.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(instrumentItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        instrumentItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {instrumentItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditInstrument(instrumentItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInstrument(instrumentItem)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </AdminPageLayout>

      {/* Create Instrument Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Instrument"
        size="lg"
      >
        <InstrumentsForm
          onSubmit={handleCreateInstrument}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createInstrument.isPending}
        />
      </Modal>

      {/* Edit Instrument Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedInstrument(null);
        }}
        title="Edit Instrument"
        size="lg"
      >
        {selectedInstrument && (
          <InstrumentsForm
            instrument={selectedInstrument}
            onSubmit={handleUpdateInstrument}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedInstrument(null);
            }}
            isLoading={updateInstrument.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedInstrument(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Instrument"
        message="Are you sure you want to delete this instrument? This action cannot be undone."
        itemName={selectedInstrument?.name}
        isLoading={deleteInstrument.isPending}
      />
    </>
  );
}
