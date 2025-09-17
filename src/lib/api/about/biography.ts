import { apiClient } from "../client";
import {
  type Biography,
  type NewBiography,
} from "@/server/db/schemas/about/biography";
import { type ApiResponse } from "@/types";

export const biographyApi = {
  // Admin API calls
  getBiography: (): Promise<ApiResponse<Biography | null>> =>
    apiClient.get("/admin/about/biography"),

  createBiography: (biography: NewBiography): Promise<ApiResponse<Biography>> =>
    apiClient.post("/admin/about/biography", biography),

  updateBiography: (
    biography: Partial<NewBiography>
  ): Promise<ApiResponse<Biography | null>> =>
    apiClient.put("/admin/about/biography", biography),

  deleteBiography: (): Promise<ApiResponse<boolean>> =>
    apiClient.delete("/admin/about/biography"),

  // Public API calls
  getPublicBiography: (): Promise<ApiResponse<Biography | null>> =>
    apiClient.get("/about/biography"),
};
