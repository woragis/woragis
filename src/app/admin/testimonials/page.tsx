"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useTestimonials } from "@/hooks/useTestimonials";
import {
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/useTestimonials";
import {
  Section,
  Container,
  Card,
  Button,
  EmptyState,
  AdminList,
  AdminGrid,
  DisplayToggle,
} from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { TestimonialForm } from "@/components/pages/admin/testimonials";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  X,
} from "lucide-react";
import type {
  Testimonial,
  TestimonialFilters,
  TestimonialFormData,
} from "@/types";
import type { AdminListItem } from "@/components/ui/admin/AdminList";
import type { AdminGridItem } from "@/components/ui/admin/AdminGrid";
import { useDisplay } from "@/contexts/DisplayContext";

export default function TestimonialsPage() {
  const [filters, setFilters] = useState<TestimonialFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { displayMode } = useDisplay();
  const {
    data: testimonials = [],
    isLoading,
    error,
  } = useTestimonials(filters);
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create testimonial
  const handleCreateTestimonial = useCallback(async (testimonialData: any) => {
    try {
      await createTestimonial.mutateAsync(testimonialData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create testimonial:", error);
    }
  }, [createTestimonial]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateTestimonial(createFormData);
    }
  }, [createFormData, handleCreateTestimonial]);

  // Edit testimonial
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  const handleUpdateTestimonial = useCallback(async (testimonialData: any) => {
    if (!selectedTestimonial) return;

    try {
      await updateTestimonial.mutateAsync({
        id: selectedTestimonial.id,
        testimonial: testimonialData,
      });
      setIsEditModalOpen(false);
      setSelectedTestimonial(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update testimonial:", error);
    }
  }, [selectedTestimonial, updateTestimonial]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedTestimonial) {
      handleUpdateTestimonial(editFormData);
    }
  }, [editFormData, selectedTestimonial, handleUpdateTestimonial]);

  const handleDelete = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTestimonial) return;

    try {
      await deleteTestimonial.mutateAsync(selectedTestimonial.id);
      setIsDeleteModalOpen(false);
      setSelectedTestimonial(null);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Testimonials
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage client testimonials and reviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
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
            title="Unable to Load Testimonials"
            description="There was an error loading the testimonials. Please try again later."
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
            Testimonials
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage client testimonials and reviews
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search testimonials..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.featured?.toString() || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  featured: e.target.value
                    ? e.target.value === "true"
                    : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Testimonials</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
            <select
              value={filters.visible?.toString() || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  visible: e.target.value
                    ? e.target.value === "true"
                    : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Visibility</option>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <DisplayToggle />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </form>
        </Card>

        {/* Testimonials Display */}
        {testimonials.length === 0 ? (
          <EmptyState
            title="No Testimonials Found"
            description="No testimonials match your current filters. Try adjusting your search criteria or add a new testimonial."
            actionLabel="Add Testimonial"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : displayMode === "grid" ? (
          <AdminGrid
            items={testimonials.map((testimonial): AdminGridItem => ({
              id: testimonial.id,
              title: testimonial.name,
              description: `"${testimonial.content}"`,
              image: testimonial.avatar,
              imageAlt: testimonial.name,
              badges: [
                ...(testimonial.featured ? [{ label: "Featured", variant: "warning" as const }] : []),
                ...(testimonial.visible ? [] : [{ label: "Hidden", variant: "error" as const }]),
                ...(testimonial.public ? [{ label: "Public", variant: "info" as const }] : [])
              ],
              metadata: [
                { label: "Position", value: `${testimonial.position} at ${testimonial.company}` },
                { label: "Rating", value: `${testimonial.rating}/5` },
                { label: "Order", value: testimonial.order.toString() }
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditTestimonial(testimonial),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(testimonial),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No testimonials found"
            emptyAction={{
              label: "Add Testimonial",
              onClick: () => setIsCreateModalOpen(true)
            }}
            columns={3}
          />
        ) : (
          <AdminList
            items={testimonials.map((testimonial): AdminListItem => ({
              id: testimonial.id,
              title: testimonial.name,
              description: `"${testimonial.content}"`,
              image: testimonial.avatar,
              imageAlt: testimonial.name,
              badges: [
                ...(testimonial.featured ? [{ label: "Featured", variant: "warning" as const }] : []),
                ...(testimonial.visible ? [] : [{ label: "Hidden", variant: "error" as const }]),
                ...(testimonial.public ? [{ label: "Public", variant: "info" as const }] : [])
              ],
              metadata: [
                { label: "Position", value: `${testimonial.position} at ${testimonial.company}` },
                { label: "Rating", value: `${testimonial.rating}/5` },
                { label: "Order", value: testimonial.order.toString() }
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditTestimonial(testimonial),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(testimonial),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No testimonials found"
            emptyAction={{
              label: "Add Testimonial",
              onClick: () => setIsCreateModalOpen(true)
            }}
          />
        )}

        {/* Create Testimonial Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Testimonial"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createTestimonial.isPending}
          maxHeight="90vh"
        >
          <TestimonialForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createTestimonial.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Testimonial Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTestimonial(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Testimonial"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedTestimonial(null);
            setEditFormData(null);
          }}
          isLoading={updateTestimonial.isPending}
          maxHeight="90vh"
        >
          {selectedTestimonial && (
            <TestimonialForm
              testimonial={selectedTestimonial}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedTestimonial(null);
              }}
              isLoading={updateTestimonial.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTestimonial(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Testimonial"
          message="Are you sure you want to delete this testimonial? This action cannot be undone."
          itemName={selectedTestimonial?.name}
          isLoading={deleteTestimonial.isPending}
        />
      </Container>
    </div>
  );
}
