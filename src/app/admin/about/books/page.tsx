"use client";

import React, { useState, useCallback } from "react";
import {
  Container,
  Card,
  Button,
  AdminList,
  AdminGrid,
  EmptyState,
  DisplayToggle,
} from "@/components/ui";
import { BooksForm, DeleteConfirmationModal } from "@/components/pages/admin";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import type { AdminListItem } from "@/components/ui/admin/AdminList";
import type { AdminGridItem } from "@/components/ui/admin/AdminGrid";
import { useDisplay } from "@/contexts/DisplayContext";
import {
  Plus,
  Search,
  Book as BookIcon,
} from "lucide-react";
import {
  useBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
  useToggleBookVisibility,
} from "@/hooks/about/useBooks";
import type { Book, NewBook, BookStatus } from "@/types";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "want_to_read", label: "Want to Read" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
  { value: "on_hold", label: "On Hold" },
];

export default function BooksAdminPage() {
  const [filters, setFilters] = useState<{ search?: string; status?: BookStatus }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { displayMode } = useDisplay();
  const { data: books = [], isLoading, error } = useBooks();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const toggleVisibility = useToggleBookVisibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filters state
  };

  // Create book
  const handleCreateBook = useCallback(async (bookData: any) => {
    try {
      await createBook.mutateAsync(bookData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  }, [createBook]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateBook(createFormData);
    }
  }, [createFormData, handleCreateBook]);

  // Edit book
  const handleEditBook = (bookItem: Book) => {
    setSelectedBook(bookItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = useCallback(async (bookData: any) => {
    if (!selectedBook) return;

    try {
      await updateBook.mutateAsync({
        id: selectedBook.id,
        book: bookData,
      });
      setIsEditModalOpen(false);
      setSelectedBook(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  }, [selectedBook, updateBook]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedBook) {
      handleUpdateBook(editFormData);
    }
  }, [editFormData, selectedBook, handleUpdateBook]);

  // Delete book
  const handleDelete = (bookItem: Book) => {
    setSelectedBook(bookItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook) return;

    try {
      await deleteBook.mutateAsync(selectedBook.id);
      setIsDeleteModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Books
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your book collection and reading list
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
            title="Unable to Load Books"
            description="There was an error loading the books. Please try again later."
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
            Books
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your book collection and reading list
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search books..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value ? (e.target.value as BookStatus) : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Status</option>
              {statusOptions.slice(1).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <DisplayToggle />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </form>
        </Card>

        {/* Books Display */}
        {books.length === 0 ? (
          <EmptyState
            title="No Books Found"
            description="No books match your current filters. Try adjusting your search criteria or add a new book."
            actionLabel="Add Book"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : displayMode === "grid" ? (
          <AdminGrid
            items={books.map((book): AdminGridItem => ({
              id: book.id,
              title: book.title,
              description: `${book.author}${book.description ? ` - ${book.description}` : ""}`,
              image: book.coverImage || "/api/placeholder/40/40",
              imageAlt: book.title,
              badges: !book.visible ? [{ label: "Hidden", variant: "error" }] : undefined,
              metadata: [
                {
                  label: "Status",
                  value: book.status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown"
                },
                ...(book.pages ? [{ label: "Pages", value: book.pages.toString() }] : []),
                ...(book.currentPage ? [{ label: "Current", value: book.currentPage.toString() }] : []),
                ...(book.rating ? [{ label: "Rating", value: `${book.rating}/10` }] : []),
                ...(book.isbn ? [{ label: "ISBN", value: book.isbn }] : [])
              ],
              toggleActions: [
                {
                  label: book.visible ? "Visible" : "Hidden",
                  isActive: book.visible || false,
                  onClick: () => handleToggleVisibility(book.id),
                  activeVariant: "success",
                  inactiveVariant: "error"
                }
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditBook(book),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(book),
                  variant: "link"
                }
              ],
              icon: <BookIcon className="w-6 h-6" />,
              iconBg: "bg-gradient-to-br from-green-500 to-blue-600"
            }))}
            emptyMessage="No books found"
            emptyAction={{
              label: "Add Book",
              onClick: () => setIsCreateModalOpen(true)
            }}
            columns={3}
          />
        ) : (
          <AdminList
            items={books.map((book): AdminListItem => ({
              id: book.id,
              title: book.title,
              description: `${book.author}${book.description ? ` - ${book.description}` : ""}`,
              image: book.coverImage || "/api/placeholder/40/40",
              imageAlt: book.title,
              badges: !book.visible ? [{ label: "Hidden", variant: "error" }] : undefined,
              metadata: [
                {
                  label: "Status",
                  value: book.status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown"
                },
                ...(book.pages ? [{ label: "Pages", value: book.pages.toString() }] : []),
                ...(book.currentPage ? [{ label: "Current", value: book.currentPage.toString() }] : []),
                ...(book.rating ? [{ label: "Rating", value: `${book.rating}/10` }] : []),
                ...(book.isbn ? [{ label: "ISBN", value: book.isbn }] : [])
              ],
              toggleActions: [
                {
                  label: book.visible ? "Visible" : "Hidden",
                  isActive: book.visible || false,
                  onClick: () => handleToggleVisibility(book.id),
                  activeVariant: "success",
                  inactiveVariant: "error"
                }
              ],
              actions: [
                {
                  label: "Edit",
                  onClick: () => handleEditBook(book),
                  variant: "link"
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(book),
                  variant: "link"
                }
              ]
            }))}
            emptyMessage="No books found"
            emptyAction={{
              label: "Add Book",
              onClick: () => setIsCreateModalOpen(true)
            }}
          />
        )}

        {/* Create Book Modal */}
        <CreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isEdit={false}
          itemName="Book"
          size="lg"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(null);
          }}
          isLoading={createBook.isPending}
          maxHeight="90vh"
        >
          <BooksForm
            userId={user?.id || ""}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createBook.isPending}
            onFormDataChange={setCreateFormData}
          />
        </CreateEditModal>

        {/* Edit Book Modal */}
        <CreateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBook(null);
            setEditFormData(null);
          }}
          isEdit={true}
          itemName="Book"
          size="lg"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedBook(null);
            setEditFormData(null);
          }}
          isLoading={updateBook.isPending}
          maxHeight="90vh"
        >
          {selectedBook && (
            <BooksForm
              book={selectedBook}
              userId={user?.id || ""}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedBook(null);
              }}
              isLoading={updateBook.isPending}
              onFormDataChange={setEditFormData}
            />
          )}
        </CreateEditModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedBook(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Book"
          message="Are you sure you want to delete this book? This action cannot be undone."
          itemName={selectedBook?.title}
          isLoading={deleteBook.isPending}
        />
      </Container>
    </div>
  );
}
