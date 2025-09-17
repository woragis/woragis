"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";
import { FilterSection } from "@/components/layout/FilterSection";
import { BooksForm, DeleteConfirmationModal } from "@/components/pages/admin";
import { ActionButton } from "@/components/ui/ActionButton";
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks
  const { data: books, isLoading, error } = useBooks();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const toggleVisibility = useToggleBookVisibility();

  const filteredBooks =
    selectedStatus === "all"
      ? books
      : books?.filter((item) => item.status === selectedStatus) || [];

  const searchedBooks =
    filteredBooks?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Create book
  const handleCreateBook = async (bookData: NewBook) => {
    try {
      await createBook.mutateAsync(bookData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  };

  // Edit book
  const handleEditBook = (bookItem: Book) => {
    setSelectedBook(bookItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = async (bookData: NewBook) => {
    if (!selectedBook) return;

    try {
      await updateBook.mutateAsync({
        id: selectedBook.id,
        book: bookData,
      });
      setIsEditModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  // Delete book
  const handleDeleteBook = (bookItem: Book) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtered state
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleVisibility.mutateAsync(id);
  };

  if (error) return <div>Error loading books</div>;

  const headerActions = (
    <ActionButton onClick={() => setIsCreateModalOpen(true)}>
      Add Book
    </ActionButton>
  );

  return (
    <>
      <AdminPageLayout
        title="Books List"
        description="Manage your book collection"
        headerActions={headerActions}
      >
        {/* Search and Filters */}
        <FilterSection
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          searchPlaceholder="Search books..."
          filterOptions={statusOptions}
          selectedFilter={selectedStatus}
          onFilterChange={(value) =>
            setSelectedStatus(value as BookStatus | "all")
          }
        />

        {/* Books List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchedBooks?.map((bookItem) => (
              <li key={bookItem.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-lg object-cover"
                        src={bookItem.coverImage || "/api/placeholder/40/40"}
                        alt={bookItem.title}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {bookItem.title}
                        </h3>
                        {!bookItem.visible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {bookItem.author}
                        {bookItem.description && ` - ${bookItem.description}`}
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Status:{" "}
                          {bookItem.status
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          {bookItem.pages && ` • Pages: ${bookItem.pages}`}
                          {bookItem.currentPage &&
                            ` • Current: ${bookItem.currentPage}`}
                          {bookItem.rating &&
                            ` • Rating: ${bookItem.rating}/10`}
                          {bookItem.isbn && ` • ISBN: ${bookItem.isbn}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(bookItem.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        bookItem.visible
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {bookItem.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEditBook(bookItem)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(bookItem)}
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

      {/* Create Book Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Book"
        size="lg"
      >
        <BooksForm
          onSubmit={handleCreateBook}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createBook.isPending}
        />
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBook(null);
        }}
        title="Edit Book"
        size="lg"
      >
        {selectedBook && (
          <BooksForm
            book={selectedBook}
            onSubmit={handleUpdateBook}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedBook(null);
            }}
            isLoading={updateBook.isPending}
          />
        )}
      </Modal>

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
    </>
  );
}
