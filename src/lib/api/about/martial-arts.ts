import { apiClient } from "../client";
import {
  type MartialArt,
  type NewMartialArt,
} from "@/server/db/schemas/about/martial-arts";
import { type ApiResponse } from "@/types";

export const martialArtsApi = {
  // Admin API calls
  getMartialArts: (): Promise<ApiResponse<MartialArt[]>> =>
    apiClient.get("/admin/about/martial-arts"),

  getMartialArt: (id: string): Promise<ApiResponse<MartialArt | null>> =>
    apiClient.get(`/admin/about/martial-arts/${id}`),

  createMartialArt: (
    martialArt: NewMartialArt
  ): Promise<ApiResponse<MartialArt>> =>
    apiClient.post("/admin/about/martial-arts", martialArt),

  updateMartialArt: (
    id: string,
    martialArt: Partial<NewMartialArt>
  ): Promise<ApiResponse<MartialArt | null>> =>
    apiClient.put(`/admin/about/martial-arts/${id}`, martialArt),

  deleteMartialArt: (id: string): Promise<ApiResponse<boolean>> =>
    apiClient.delete(`/admin/about/martial-arts/${id}`),

  toggleMartialArtVisibility: (
    id: string
  ): Promise<ApiResponse<MartialArt | null>> =>
    apiClient.put(`/admin/about/martial-arts/${id}/toggle-visibility`),

  // Public API calls
  getPublicMartialArts: (): Promise<ApiResponse<MartialArt[]>> =>
    apiClient.get("/about/martial-arts"),
};
