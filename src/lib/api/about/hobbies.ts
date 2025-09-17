import { apiClient } from "../client";
import { type Hobby, type NewHobby } from "@/server/db/schemas/about/hobbies";
import { type ApiResponse } from "@/server/types";

export const hobbiesApi = {
  // Admin API calls
  getHobbies: (): Promise<ApiResponse<Hobby[]>> =>
    apiClient.get("/admin/about/hobbies"),

  getHobby: (id: string): Promise<ApiResponse<Hobby | null>> =>
    apiClient.get(`/admin/about/hobbies/${id}`),

  createHobby: (hobby: NewHobby): Promise<ApiResponse<Hobby>> =>
    apiClient.post("/admin/about/hobbies", hobby),

  updateHobby: (
    id: string,
    hobby: Partial<NewHobby>
  ): Promise<ApiResponse<Hobby | null>> =>
    apiClient.put(`/admin/about/hobbies/${id}`, hobby),

  deleteHobby: (id: string): Promise<ApiResponse<boolean>> =>
    apiClient.delete(`/admin/about/hobbies/${id}`),

  toggleHobbyVisibility: (id: string): Promise<ApiResponse<Hobby | null>> =>
    apiClient.put(`/admin/about/hobbies/${id}/toggle-visibility`),

  // Public API calls
  getPublicHobbies: (): Promise<ApiResponse<Hobby[]>> =>
    apiClient.get("/about/hobbies"),
};
