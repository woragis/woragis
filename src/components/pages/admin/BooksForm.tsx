"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
} from "@/components/pages/admin";
import type { Book, NewBook, BookStatus } from "@/types";

interface BooksFormProps {
  book?: Book;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

const statusOptions: { value: BookStatus; label: string }[] = [
  { value: "want_to_read", label: "Want to Read" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
  { value: "on_hold", label: "On Hold" },
];

export const BooksForm: React.FC<BooksFormProps> = ({
  book,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
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

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        status: book.status || "want_to_read",
        isbn: book.isbn || "",
        coverImage: book.coverImage || "",
        genres: book.genres || "",
        pages: book.pages || 0,
        currentPage: book.currentPage || 0,
        rating: book.rating || 0,
        notes: book.notes || "",
        order: book.order || 0,
        visible: book.visible || true,
      });
    }
  }, [book]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  // Notify parent of form data changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        userId,
      });
    }
  }, [formData, userId, onFormDataChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={book ? "Update Book" : "Create Book"}
      isLoading={isLoading}
    >
      <FormField label="Title" required>
        <FormInput
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          required
        />
      </FormField>

      <FormField label="Author" required>
        <FormInput
          name="author"
          value={formData.author || ""}
          onChange={handleInputChange}
          required
        />
      </FormField>

      <FormField label="Description">
        <FormTextarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
        />
      </FormField>

      <FormField label="Status" required>
        <FormSelect
          name="status"
          value={formData.status || "want_to_read"}
          onChange={handleInputChange}
          options={statusOptions}
          required
        />
      </FormField>

      <FormField label="ISBN">
        <FormInput
          name="isbn"
          value={formData.isbn || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Cover Image URL">
        <FormInput
          type="url"
          name="coverImage"
          value={formData.coverImage || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Genres">
        <FormInput
          name="genres"
          value={formData.genres || ""}
          onChange={handleInputChange}
          placeholder="Fiction, Fantasy, Science Fiction..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Total Pages">
          <FormInput
            type="number"
            name="pages"
            value={formData.pages || 0}
            onChange={handleInputChange}
            min={0}
          />
        </FormField>

        <FormField label="Current Page">
          <FormInput
            type="number"
            name="currentPage"
            value={formData.currentPage || 0}
            onChange={handleInputChange}
            min={0}
          />
        </FormField>
      </div>

      <FormField label="Rating (1-10)">
        <FormInput
          type="number"
          name="rating"
          value={formData.rating || 0}
          onChange={handleInputChange}
          min={0}
          max={10}
        />
      </FormField>

      <FormField label="Notes">
        <FormTextarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleInputChange}
          rows={3}
        />
      </FormField>

      <FormField label="Display Order">
        <FormInput
          type="number"
          name="order"
          value={formData.order || 0}
          onChange={handleInputChange}
          min={0}
        />
      </FormField>

      <FormCheckbox
        name="visible"
        checked={formData.visible || true}
        onChange={handleInputChange}
        label="Visible to public"
      />
    </AdminForm>
  );
};
