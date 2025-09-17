import { NextRequest } from "next/server";
import { bookService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewBook, BookFilters } from "@/types";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const validStatuses = [
    "completed",
    "dropped",
    "on_hold",
    "want_to_read",
    "reading",
  ];
  const status =
    statusParam && validStatuses.includes(statusParam)
      ? (statusParam as any)
      : undefined;

  const filters: BookFilters = {
    search: searchParams.get("search") || undefined,
    status,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await bookService.getAllBooks(filters, authResult.userId);
  return handleServiceResult(result, "Books fetched successfully");
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const bookData: NewBook = body;

  const result = await bookService.createBook(bookData, authResult.userId);
  return handleServiceResult(result, "Book created successfully", 201);
});
