import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

/**
 * Standardized API response helpers
 *
 * All API routes should use these helpers to ensure consistent response structure:
 * - success: boolean
 * - data?: T (only present on success)
 * - error?: string (only present on failure)
 * - message?: string (optional success message)
 */

// Success responses
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return NextResponse.json(response, { status });
}

export function createdResponse<T>(
  data: T,
  message: string = "Resource created successfully"
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 201);
}

export function updatedResponse<T>(
  data: T,
  message: string = "Resource updated successfully"
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 200);
}

export function deletedResponse(
  message: string = "Resource deleted successfully"
): NextResponse<ApiResponse<void>> {
  return successResponse(undefined, message, 200);
}

// Error responses
export function errorResponse(
  error: string,
  status: number = 500,
  details?: any
): NextResponse<ApiResponse<null>> {
  const response: ApiResponse<null> = {
    success: false,
    error,
    ...(details && { details }),
  };

  return NextResponse.json(response, { status });
}

export function badRequestResponse(
  error: string = "Bad request",
  details?: any
): NextResponse<ApiResponse<null>> {
  return errorResponse(error, 400, details);
}

export function unauthorizedResponse(
  error: string = "Unauthorized"
): NextResponse<ApiResponse<null>> {
  return errorResponse(error, 401);
}

export function forbiddenResponse(
  error: string = "Forbidden"
): NextResponse<ApiResponse<null>> {
  return errorResponse(error, 403);
}

export function notFoundResponse(
  error: string = "Resource not found"
): NextResponse<ApiResponse<null>> {
  return errorResponse(error, 404);
}

export function conflictResponse(
  error: string = "Resource already exists"
): NextResponse<ApiResponse<null>> {
  return errorResponse(error, 409);
}

export function internalServerErrorResponse(
  error: string = "Internal server error",
  details?: any
): NextResponse<ApiResponse<null>> {
  return errorResponse(error, 500, details);
}

// Validation error response
export function validationErrorResponse(
  errors: Record<string, string[]> | string[],
  message: string = "Validation failed"
): NextResponse<ApiResponse<null>> {
  const response: ApiResponse<null> = {
    success: false,
    error: message,
    details: {
      type: "validation_error",
      errors,
    },
  };

  return NextResponse.json(response, { status: 422 });
}

// Service result handler - converts service results to standardized responses
export function handleServiceResult<T>(
  result: { success: boolean; data?: T; error?: string },
  successMessage?: string,
  successStatus: number = 200
): NextResponse<ApiResponse<T>> {
  if (result.success) {
    return successResponse(result.data!, successMessage, successStatus);
  }

  return errorResponse(result.error || "Service error", 500) as NextResponse<
    ApiResponse<T>
  >;
}

// Async error handler wrapper
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("API Route Error:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("An unexpected error occurred");
    }
  };
}

// Authentication error handler
export function handleAuthError(
  error?: string
): NextResponse<ApiResponse<null>> {
  return unauthorizedResponse(error || "Authentication required");
}
