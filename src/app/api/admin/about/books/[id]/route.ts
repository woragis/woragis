import { NextRequest, NextResponse } from "next/server";
import { bookService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Book ID is required" },
        { status: 400 }
      );
    }
    const result = await bookService.getBookById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch book" },
      { status: 500 }
    );
  }
});

export const PUT = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Book ID is required" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const result = await bookService.updateBook(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update book" },
      { status: 500 }
    );
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Book ID is required" },
        { status: 400 }
      );
    }
    const result = await bookService.deleteBook(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete book" },
      { status: 500 }
    );
  }
});
