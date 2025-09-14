import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUser {
  userId: string;
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getServerAuth(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    // Verify token with the API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      return null;
    }

    const userData = data.data;

    // Map API response to AuthUser interface
    const authUser: AuthUser = {
      id: userData.id,
      email: userData.email,
      name:
        userData.firstName && userData.lastName
          ? `${userData.firstName} ${userData.lastName}`.trim()
          : userData.username || userData.email,
      role: userData.role,
      avatar: userData.avatar,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    return authUser;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

export function requireAuth(
  handler: (
    request: NextRequest,
    user: AuthenticatedUser
  ) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest) => {
    const authUser = await getServerAuth();

    if (!authUser) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Convert AuthUser to AuthenticatedUser format
    const authenticatedUser: AuthenticatedUser = {
      ...authUser,
      userId: authUser.id,
    };

    return handler(request, authenticatedUser);
  };
}

export function requireAdmin(
  handler: (
    request: NextRequest,
    user: AuthenticatedUser
  ) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest) => {
    const authUser = await getServerAuth();

    if (!authUser) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (authUser.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Convert AuthUser to AuthenticatedUser format
    const authenticatedUser: AuthenticatedUser = {
      ...authUser,
      userId: authUser.id,
    };

    return handler(request, authenticatedUser);
  };
}

// Auth middleware that returns a result object instead of redirecting
export async function authMiddleware(request: NextRequest): Promise<{
  success: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const authUser = await getServerAuth();

    if (!authUser) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    return {
      success: true,
      userId: authUser.id,
    };
  } catch (error) {
    console.error("Auth middleware error:", error);
    return {
      success: false,
      error: "Authentication failed",
    };
  }
}
