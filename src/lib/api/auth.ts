import { apiClient } from "./client";
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";
import type { ApiResponse } from "@/types";

// Auth API functions
export const authApi = {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return apiClient.post("/auth/login", credentials);
  },

  async register(
    data: RegisterData
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return apiClient.post("/auth/register", data);
  },

  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post("/auth/logout");
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return apiClient.post("/auth/refresh", { refreshToken });
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    return apiClient.get("/auth/me");
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put("/auth/profile", data);
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return apiClient.put("/auth/change-password", data);
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return apiClient.post("/auth/reset-password", data);
  },

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post("/auth/verify-email", { token });
  },

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiClient.post("/auth/resend-verification");
  },
};
