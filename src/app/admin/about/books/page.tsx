"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import {
  useBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
} from "@/hooks/about/useBooks";
import type { Book, NewBook, BookStatus } from "@/types";

export default function BooksAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | "all">(
    "all"
  );

  // Hooks
  const { data: books, isLoading, error } = useBooks();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  // Form state
  const [formData, setFormData] = useState<Partial<NewBook>>({
    title: "",
    author: "",
    description: "",
    status: "want_to_read",
    isbn: "",
    coverImage: "",
    genres: "",
    pages: 0,
    currentPage: 0,
    rating: 0,
    notes: "",
    order: 0,
    visible: true,
  });

  const statusOptions: { value: BookStatus; label: string }[] = [
    { value: "want_to_read", label: "Want to Read" },
    { value: "reading", label: "Reading" },
    { value: "completed", label: "Completed" },
    { value: "dropped", label: "Dropped" },
    { value: "on_hold", label: "On Hold" },
  ];

  const filteredBooks =
    selectedStatus === "all"
      ? books
      : books?.filter((book) => book.status === selectedStatus) || [];

  const handleCreate = async () => {
    try {
      await createBook.mutateAsync(formData as NewBook);
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        author: "",
        description: "",
        status: "want_to_read",
        isbn: "",
        coverImage: "",
        genres: "",
        pages: 0,
        currentPage: 0,
        rating: 0,
        notes: "",
        order: 0,
        visible: true,
      });
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      status: book.status,
      isbn: book.isbn,
      coverImage: book.coverImage,
      genres: book.genres ? book.genres : "",
      pages: book.pages,
      currentPage: book.currentPage,
      rating: book.rating,
      notes: book.notes,
      order: book.order,
      visible: book.visible,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedBook) return;

    try {
      await updateBook.mutateAsync({
        id: selectedBook.id,
        book: formData,
      });
      setIsEditModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <label className="flex items-center text-gray-700">
            <input
              type="radio"
              name="status"
              value="all"
              checked={selectedStatus === "all"}
              onChange={(e) =>
                setSelectedStatus(e.target.value as BookStatus | "all")
              }
              className="mr-2"
            />
            All
          </label>
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-gray-700"
            >
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={selectedStatus === option.value}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as BookStatus)
                }
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredBooks?.map((book) => (
            <li key={book.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {book.coverImage ? (
                      <img
                        className="h-16 w-12 rounded object-cover"
                        src={book.coverImage}
                        alt={book.title}
                      />
                    ) : (
                      <div className="h-16 w-12 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">📚</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {book.title}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">
                        by {book.author}
                      </span>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          book.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : book.status === "reading"
                            ? "bg-blue-100 text-blue-800"
                            : book.status === "want_to_read"
                            ? "bg-yellow-100 text-yellow-800"
                            : book.status === "dropped"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {
                          statusOptions.find((s) => s.value === book.status)
                            ?.label
                        }
                      </span>
                    </div>
                    {book.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {book.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-400">
                        Pages: {book.currentPage || 0}/{book.pages || "?"}
                      </span>
                      {book.rating && (
                        <span className="text-xs text-gray-400">
                          Rating: {book.rating}/10
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Order: {book.order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      book.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.visible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredBooks?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No books found. Add some books to get started!
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Book"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Author *
            </label>
            <input
              type="text"
              value={formData.author || ""}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
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
              Status *
            </label>
            <select
              value={formData.status || "want_to_read"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as BookStatus,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pages
              </label>
              <input
                type="number"
                value={formData.pages || 0}
                onChange={(e) =>
                  setFormData({ ...formData, pages: parseInt(e.target.value) })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Page
              </label>
              <input
                type="number"
                value={formData.currentPage || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentPage: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.rating || 0}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn || ""}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
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
              disabled={
                createBook.isPending || !formData.title || !formData.author
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createBook.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBook(null);
        }}
        title="Edit Book"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Author *
            </label>
            <input
              type="text"
              value={formData.author || ""}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
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
              Status *
            </label>
            <select
              value={formData.status || "want_to_read"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as BookStatus,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pages
              </label>
              <input
                type="number"
                value={formData.pages || 0}
                onChange={(e) =>
                  setFormData({ ...formData, pages: parseInt(e.target.value) })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Page
              </label>
              <input
                type="number"
                value={formData.currentPage || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentPage: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.rating || 0}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn || ""}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
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
                setSelectedBook(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={
                updateBook.isPending || !formData.title || !formData.author
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {updateBook.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
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
    </div>
  );
}
