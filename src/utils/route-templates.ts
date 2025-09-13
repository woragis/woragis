/**
 * Standardized route templates for consistent API responses
 *
 * These templates can be used to quickly standardize API routes
 */

import { NextRequest } from "next/server";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  successResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  notFoundResponse,
  badRequestResponse,
  unauthorizedResponse,
} from "./response-helpers";

/**
 * Template for public GET routes (no authentication required)
 */
export function createPublicGetRoute<T>(
  serviceCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  successMessage: string = "Data fetched successfully"
) {
  return withErrorHandling(async () => {
    const result = await serviceCall();
    return handleServiceResult(result, successMessage);
  });
}

/**
 * Template for public GET routes with parameters
 */
export function createPublicGetRouteWithParams<T, P>(
  serviceCall: (
    params: P
  ) => Promise<{ success: boolean; data?: T; error?: string }>,
  successMessage: string = "Data fetched successfully"
) {
  return withErrorHandling(
    async (request: NextRequest, { params }: { params: P }) => {
      const result = await serviceCall(params);
      return handleServiceResult(result, successMessage);
    }
  );
}

/**
 * Template for authenticated GET routes
 */
export function createAuthenticatedGetRoute<T>(
  serviceCall: (
    userId: string
  ) => Promise<{ success: boolean; data?: T; error?: string }>,
  successMessage: string = "Data fetched successfully"
) {
  return withErrorHandling(
    async (request: NextRequest, user: { userId: string }) => {
      const result = await serviceCall(user.userId);
      return handleServiceResult(result, successMessage);
    }
  );
}

/**
 * Template for authenticated POST routes
 */
export function createAuthenticatedPostRoute<T, D>(
  serviceCall: (
    data: D,
    userId: string
  ) => Promise<{ success: boolean; data?: T; error?: string }>,
  successMessage: string = "Resource created successfully"
) {
  return withErrorHandling(
    async (request: NextRequest, user: { userId: string }) => {
      const body = await request.json();
      const result = await serviceCall(body, user.userId);
      return handleServiceResult(result, successMessage, 201);
    }
  );
}

/**
 * Template for authenticated PUT routes
 */
export function createAuthenticatedPutRoute<T, D>(
  serviceCall: (
    id: string,
    data: D,
    userId: string
  ) => Promise<{ success: boolean; data?: T; error?: string }>,
  successMessage: string = "Resource updated successfully"
) {
  return withErrorHandling(
    async (
      request: NextRequest,
      user: { userId: string },
      { params }: { params: { id: string } }
    ) => {
      const body = await request.json();
      const result = await serviceCall(params.id, body, user.userId);
      return handleServiceResult(result, successMessage);
    }
  );
}

/**
 * Template for authenticated DELETE routes
 */
export function createAuthenticatedDeleteRoute(
  serviceCall: (
    id: string,
    userId: string
  ) => Promise<{ success: boolean; error?: string }>,
  successMessage: string = "Resource deleted successfully"
) {
  return withErrorHandling(
    async (
      request: NextRequest,
      user: { userId: string },
      { params }: { params: { id: string } }
    ) => {
      const result = await serviceCall(params.id, user.userId);

      if (!result.success) {
        return notFoundResponse(result.error || "Resource not found");
      }

      return deletedResponse(successMessage);
    }
  );
}

/**
 * Template for authenticated PATCH routes
 */
export function createAuthenticatedPatchRoute<T, D>(
  serviceCall: (
    id: string,
    data: D,
    userId: string
  ) => Promise<{ success: boolean; data?: T; error?: string }>,
  successMessage: string = "Resource updated successfully"
) {
  return withErrorHandling(
    async (
      request: NextRequest,
      user: { userId: string },
      { params }: { params: { id: string } }
    ) => {
      const body = await request.json();
      const result = await serviceCall(params.id, body, user.userId);
      return handleServiceResult(result, successMessage);
    }
  );
}
