"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { Book } from "@/types";

// Import ListItem type from ItemList component
type ListItem = Parameters<typeof ItemList>[0]["items"][0];

interface BooksListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onToggleVisibility?: (book: Book) => void;
  isLoading?: boolean;
}

const getStatusVariant = (
  status: string
): "default" | "success" | "warning" | "error" | "info" => {
  switch (status) {
    case "completed":
      return "success";
    case "reading":
      return "info";
    case "want_to_read":
      return "default";
    case "dropped":
      return "error";
    case "on_hold":
      return "warning";
    default:
      return "default";
  }
};

export const BooksList: React.FC<BooksListProps> = ({
  books,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  const items = books.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${item.author}${
      item.description ? ` - ${item.description}` : ""
    }`,
    image: item.coverImage || undefined,
    status: item.status
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    statusVariant: getStatusVariant(item.status || ""),
    visible: item.visible ?? undefined,
    featured: false, // Books doesn't have featured field
    metadata: {
      pages: item.pages,
      currentPage: item.currentPage,
      rating: item.rating,
      genres: item.genres,
      isbn: item.isbn,
    },
  }));

  // Create a mapping from item ID back to book object
  const booksMap = new Map(books.map((item) => [item.id, item]));

  const handleEdit = (listItem: ListItem) => {
    const bookItem = booksMap.get(listItem.id);
    if (bookItem) {
      onEdit(bookItem);
    }
  };

  const handleDelete = (listItem: ListItem) => {
    const bookItem = booksMap.get(listItem.id);
    if (bookItem) {
      onDelete(bookItem);
    }
  };

  const handleToggleVisibility = (listItem: ListItem) => {
    if (onToggleVisibility) {
      const bookItem = booksMap.get(listItem.id);
      if (bookItem) {
        onToggleVisibility(bookItem);
      }
    }
  };

  return (
    <ItemList
      items={items}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleVisibility={handleToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No books found"
    />
  );
};
