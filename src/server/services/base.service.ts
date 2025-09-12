import type { ApiResponse } from "@/types";

export abstract class BaseService {
  protected handleError(error: unknown, context: string): ApiResponse {
    console.error(`Error in ${context}:`, error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }

  protected success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  protected validateId(id: string): boolean {
    return id && id.trim().length > 0;
  }

  protected validateRequired<T>(data: T, fields: (keyof T)[]): string[] {
    const errors: string[] = [];

    for (const field of fields) {
      if (
        !data[field] ||
        (typeof data[field] === "string" && !data[field].trim())
      ) {
        errors.push(`${String(field)} is required`);
      }
    }

    return errors;
  }
}
