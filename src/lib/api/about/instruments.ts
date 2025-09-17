import { apiClient } from "../client";
import {
  type Instrument,
  type NewInstrument,
} from "@/server/db/schemas/about/instruments";
import { type ApiResponse } from "@/server/types";

export const instrumentsApi = {
  // Admin API calls
  getInstruments: (): Promise<ApiResponse<Instrument[]>> =>
    apiClient.get("/admin/about/instruments"),

  getInstrument: (id: string): Promise<ApiResponse<Instrument | null>> =>
    apiClient.get(`/admin/about/instruments/${id}`),

  createInstrument: (
    instrument: NewInstrument
  ): Promise<ApiResponse<Instrument>> =>
    apiClient.post("/admin/about/instruments", instrument),

  updateInstrument: (
    id: string,
    instrument: Partial<NewInstrument>
  ): Promise<ApiResponse<Instrument | null>> =>
    apiClient.put(`/admin/about/instruments/${id}`, instrument),

  deleteInstrument: (id: string): Promise<ApiResponse<boolean>> =>
    apiClient.delete(`/admin/about/instruments/${id}`),

  toggleInstrumentVisibility: (
    id: string
  ): Promise<ApiResponse<Instrument | null>> =>
    apiClient.put(`/admin/about/instruments/${id}/toggle-visibility`),

  // Public API calls
  getPublicInstruments: (): Promise<ApiResponse<Instrument[]>> =>
    apiClient.get("/about/instruments"),
};
