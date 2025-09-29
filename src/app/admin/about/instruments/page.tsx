"use client";

import React, { useState, useCallback } from "react";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import {
  DeleteConfirmationModal,
  InstrumentsForm,
} from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Guitar,
  Eye,
  EyeOff,
  Calendar,
  Hash,
} from "lucide-react";
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

export default function InstrumentsAdminPage() {
  const [filters, setFilters] = useState<{ search?: string; level?: KnowledgeLevel }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: instruments = [], isLoading, error } = useInstruments();
  const createInstrument = useCreateInstrument();
  const updateInstrument = useUpdateInstrument();
  const deleteInstrument = useDeleteInstrument();
  const toggleVisibility = useToggleInstrumentVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create instrument
  const handleCreateInstrument = useCallback(async (instrumentData: any) => {
    try {
      await createInstrument.mutateAsync(instrumentData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create instrument:", error);
    }
  }, [createInstrument]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateInstrument(createFormData);
    }
  }, [createFormData, handleCreateInstrument]);

  // Edit instrument
  const handleEditInstrument = (instrumentItem: Instrument) => {
    setSelectedInstrument(instrumentItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateInstrument = useCallback(async (instrumentData: any) => {
    if (!selectedInstrument) return;

    try {
      await updateInstrument.mutateAsync({
        id: selectedInstrument.id,
        instrument: instrumentData,
      });
      setIsEditModalOpen(false);
      setSelectedInstrument(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update instrument:", error);
    }
  }, [selectedInstrument, updateInstrument]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedInstrument) {
      handleUpdateInstrument(editFormData);
    }
  }, [editFormData, selectedInstrument, handleUpdateInstrument]);

  // Delete instrument
  const handleDelete = (instrumentItem: Instrument) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Instruments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your musical instruments and learning progress
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <EmptyState
            title="Unable to Load Instruments"
            description="There was an error loading the instruments. Please try again later."
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Instruments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your musical instruments and learning progress
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search instruments..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.level || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  level: e.target.value ? (e.target.value as KnowledgeLevel) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Instrument
            </Button>
          </form>
        </Card>

        {/* Instruments Grid */}
        {instruments.length === 0 ? (
          <EmptyState
            title="No Instruments Found"
            description="No instruments match your current filters. Try adjusting your search criteria or add a new instrument."
            actionLabel="Add Instrument"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instruments.map((instrument) => (
              <Card key={instrument.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        <Guitar className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {instrument.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Musical Instrument
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditInstrument(instrument)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(instrument)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Knowledge Level Badge */}
                  <div className="mb-4">
                    <Badge
                      className={getKnowledgeLevelColor(
                        instrument.knowledgeLevel || "beginner"
                      )}
                    >
                      {getKnowledgeLevelLabel(
                        instrument.knowledgeLevel || "beginner"
                      )}
                    </Badge>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {new Date(instrument.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {instrument.visible ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Visible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Instrument Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Instrument"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createInstrument.isPending}
          maxHeight="90vh"
        >
          <InstrumentsForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createInstrument.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Instrument Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedInstrument(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Instrument"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedInstrument(null);
            setEditFormData(null);
          }}
          isLoading={updateInstrument.isPending}
          maxHeight="90vh"
        >
          {selectedInstrument && (
            <InstrumentsForm
              instrument={selectedInstrument}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedInstrument(null);
              }}
              isLoading={updateInstrument.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

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
      </Container>
    </div>
  );
}
