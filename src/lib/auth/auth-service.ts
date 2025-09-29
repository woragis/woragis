import { apiClient } from "../clients/apiClient";
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "@/stores/auth-store";
import type { ApiResponse } from "@/types";

export class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<AuthTokens> | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login user
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      "/auth/login",
      credentials
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Login failed");
    }

    return response.data;
  }

  // Register user
  async register(
    data: RegisterData
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      "/auth/register",
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Registration failed");
    }

    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Even if logout fails on server, we should clear local state
      console.warn("Logout request failed:", error);
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>("/auth/refresh", {
      refreshToken,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || "Token refresh failed");
    }

    return response.data;
  }

  // Get current user
  async getCurrentUser(accessToken: string): Promise<User> {
    const response = await apiClient.get<User>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to get user data");
    }

    return response.data;
  }

  // Update user profile
  async updateProfile(
    userId: string,
    data: Partial<User>,
    accessToken: string
  ): Promise<User> {
    const response = await apiClient.put<User>(`/auth/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to update profile");
    }

    return response.data;
  }

  // Change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    accessToken: string
  ): Promise<void> {
    const response = await apiClient.post(
      `/auth/users/${userId}/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to change password");
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    const response = await apiClient.post("/auth/forgot-password", { email });

    if (!response.success) {
      throw new Error(response.error || "Failed to request password reset");
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to reset password");
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post("/auth/verify-email", { token });

    if (!response.success) {
      throw new Error(response.error || "Failed to verify email");
    }
  }

  // Resend verification email
  async resendVerificationEmail(accessToken: string): Promise<void> {
    const response = await apiClient.post(
      "/auth/resend-verification",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to resend verification email");
    }
  }

  // Check if token is expired
  isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  // Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon(expiresAt: number): boolean {
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() >= expiresAt - fiveMinutes;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
