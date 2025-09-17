import { InstrumentsRepository } from "../../repositories/about/instruments.repository";
import {
  type Instrument,
  type NewInstrument,
} from "../../db/schemas/about/instruments";
import { BaseService } from "../base.service";
import { ApiResponse } from "@/types";

const instrumentsRepository = new InstrumentsRepository();

export class InstrumentsService extends BaseService {
  async createInstrument(
    instrumentData: NewInstrument,
    userId: string
  ): Promise<ApiResponse<Instrument>> {
    try {
      const requiredFields: (keyof NewInstrument)[] = ["name"];
      const validationErrors = this.validateRequired(
        instrumentData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const instrumentWithUserId = { ...instrumentData, userId };
      const instrument = await instrumentsRepository.create(
        instrumentWithUserId
      );
      return this.success(instrument, "Instrument created successfully");
    } catch (error) {
      return this.handleError(error, "createInstrument");
    }
  }

  async getInstrumentById(id: string): Promise<ApiResponse<Instrument | null>> {
    try {
      const instrument = await instrumentsRepository.findById(id);
      return this.success(instrument);
    } catch (error) {
      return this.handleError(error, "getInstrumentById");
    }
  }

  async getInstrumentsByUserId(
    userId: string
  ): Promise<ApiResponse<Instrument[]>> {
    try {
      const instruments = await instrumentsRepository.findByUserId(userId);
      return this.success(instruments);
    } catch (error) {
      return this.handleError(error, "getInstrumentsByUserId");
    }
  }

  async getVisibleInstrumentsByUserId(
    userId: string
  ): Promise<ApiResponse<Instrument[]>> {
    try {
      const instruments = await instrumentsRepository.findVisibleByUserId(
        userId
      );
      return this.success(instruments);
    } catch (error) {
      return this.handleError(error, "getVisibleInstrumentsByUserId");
    }
  }

  async updateInstrument(
    id: string,
    instrumentData: Partial<NewInstrument>
  ): Promise<ApiResponse<Instrument | null>> {
    try {
      const instrument = await instrumentsRepository.update(id, instrumentData);
      if (!instrument) {
        return {
          success: false,
          error: "Instrument not found",
        };
      }
      return this.success(instrument, "Instrument updated successfully");
    } catch (error) {
      return this.handleError(error, "updateInstrument");
    }
  }

  async deleteInstrument(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await instrumentsRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: "Instrument not found",
        };
      }
      return this.success(true, "Instrument deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteInstrument");
    }
  }

  async getAllInstruments(): Promise<ApiResponse<Instrument[]>> {
    try {
      const instruments = await instrumentsRepository.findAll();
      return this.success(instruments);
    } catch (error) {
      return this.handleError(error, "getAllInstruments");
    }
  }

  async getVisibleInstruments(): Promise<ApiResponse<Instrument[]>> {
    try {
      const instruments = await instrumentsRepository.findVisible();
      return this.success(instruments);
    } catch (error) {
      return this.handleError(error, "getVisibleInstruments");
    }
  }
}
