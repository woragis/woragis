"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { Book } from "@/types";

interface BooksListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onToggleVisibility?: (book: Book) => void;
  isLoading?: boolean;
}

const getStatusVariant = (status: string) => {
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
    image: item.coverImage,
    status: item.status
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    statusVariant: getStatusVariant(item.status || ""),
    visible: item.visible,
    featured: false, // Books doesn't have featured field
    metadata: {
      pages: item.pages,
      currentPage: item.currentPage,
      rating: item.rating,
      genres: item.genres,
      isbn: item.isbn,
    },
  }));

  return (
    <ItemList
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No books found"
    />
  );
};
