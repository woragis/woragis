import { apiClient } from "../client";
import {
  type Language,
  type NewLanguage,
} from "@/server/db/schemas/about/languages";
import { type ApiResponse } from "@/server/types";

export const languagesApi = {
  // Admin API calls
  getLanguages: (): Promise<ApiResponse<Language[]>> =>
    apiClient.get("/admin/about/languages"),

  getLanguage: (id: string): Promise<ApiResponse<Language | null>> =>
    apiClient.get(`/admin/about/languages/${id}`),

  createLanguage: (language: NewLanguage): Promise<ApiResponse<Language>> =>
    apiClient.post("/admin/about/languages", language),

  updateLanguage: (
    id: string,
    language: Partial<NewLanguage>
  ): Promise<ApiResponse<Language | null>> =>
    apiClient.put(`/admin/about/languages/${id}`, language),

  deleteLanguage: (id: string): Promise<ApiResponse<boolean>> =>
    apiClient.delete(`/admin/about/languages/${id}`),

  toggleLanguageVisibility: (
    id: string
  ): Promise<ApiResponse<Language | null>> =>
    apiClient.put(`/admin/about/languages/${id}/toggle-visibility`),

  // Public API calls
  getPublicLanguages: (): Promise<ApiResponse<Language[]>> =>
    apiClient.get("/about/languages"),
};
