import { NextRequest } from "next/server";
import { authService } from "../server/services";
import { UserRole } from "../types";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
}

export async function authenticateUser(request: NextRequest): Promise<{
  user: AuthenticatedUser | null;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "No authorization token provided" };
    }

    const token = authHeader.substring(7);
    const tokenData = await authService.verifyToken(token);

    if (!tokenData) {
      return { user: null, error: "Invalid or expired token" };
    }

    return {
      user: {
        userId: tokenData.userId,
        email: tokenData.email,
        username: tokenData.username,
        role: tokenData.role,
      },
    };
  } catch (error) {
    return { user: null, error: "Authentication failed" };
  }
}

export function requireAuth(
  handler: (
    request: NextRequest,
    user: AuthenticatedUser,
    context?: any
  ) => Promise<Response>
) {
  return async (request: NextRequest, context?: any): Promise<Response> => {
    const { user, error } = await authenticateUser(request);

    if (!user) {
      return Response.json(
        { success: false, error: error || "Authentication required" },
        { status: 401 }
      );
    }

    return handler(request, user, context);
  };
}

export function requireRole(role: UserRole) {
  return function (
    handler: (
      request: NextRequest,
      user: AuthenticatedUser
    ) => Promise<Response>
  ) {
    return async (request: NextRequest): Promise<Response> => {
      const { user, error } = await authenticateUser(request);

      if (!user) {
        return Response.json(
          { success: false, error: error || "Authentication required" },
          { status: 401 }
        );
      }

      if (user.role !== role && user.role !== "super_admin") {
        return Response.json(
          { success: false, error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      return handler(request, user);
    };
  };
}

export function requireAdmin(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>
) {
  return requireRole("admin")(handler);
}

export function requireSuperAdmin(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>
) {
  return requireRole("super_admin")(handler);
}

export async function authMiddleware(request: NextRequest): Promise<{
  success: boolean;
  userId?: string;
  error?: string;
}> {
  const { user, error } = await authenticateUser(request);
  
  if (!user) {
    return { success: false, error: error || "Authentication required" };
  }
  
  return { success: true, userId: user.userId };
}
