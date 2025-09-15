import { NextRequest } from "next/server";
import { bookService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await bookService.getBookById(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error fetching book:", error);
      return Response.json(
        { success: false, error: "Failed to fetch book" },
        { status: 500 }
      );
    }
  }
);

export const PUT = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const data = await request.json();
      const result = await bookService.updateBook(params.id, data);
      return Response.json(result);
    } catch (error) {
      console.error("Error updating book:", error);
      return Response.json(
        { success: false, error: "Failed to update book" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await bookService.deleteBook(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error deleting book:", error);
      return Response.json(
        { success: false, error: "Failed to delete book" },
        { status: 500 }
      );
    }
  }
);
