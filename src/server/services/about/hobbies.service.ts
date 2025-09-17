import { HobbiesRepository } from "../../repositories/about/hobbies.repository";
import { type Hobby, type NewHobby } from "../../db/schemas/about/hobbies";
import { BaseService } from "../base.service";
import { ApiResponse } from "../../types";

const hobbiesRepository = new HobbiesRepository();

export class HobbiesService extends BaseService {
  async createHobby(
    hobbyData: NewHobby,
    userId: string
  ): Promise<ApiResponse<Hobby>> {
    try {
      const requiredFields: (keyof NewHobby)[] = ["name"];
      const validationErrors = this.validateRequired(hobbyData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const hobbyWithUserId = { ...hobbyData, userId };
      const hobby = await hobbiesRepository.create(hobbyWithUserId);
      return this.success(hobby, "Hobby created successfully");
    } catch (error) {
      return this.handleError(error, "createHobby");
    }
  }

  async getHobbyById(id: string): Promise<ApiResponse<Hobby | null>> {
    try {
      const hobby = await hobbiesRepository.findById(id);
      return this.success(hobby);
    } catch (error) {
      return this.handleError(error, "getHobbyById");
    }
  }

  async getHobbiesByUserId(userId: string): Promise<ApiResponse<Hobby[]>> {
    try {
      const hobbies = await hobbiesRepository.findByUserId(userId);
      return this.success(hobbies);
    } catch (error) {
      return this.handleError(error, "getHobbiesByUserId");
    }
  }

  async getVisibleHobbiesByUserId(
    userId: string
  ): Promise<ApiResponse<Hobby[]>> {
    try {
      const hobbies = await hobbiesRepository.findVisibleByUserId(userId);
      return this.success(hobbies);
    } catch (error) {
      return this.handleError(error, "getVisibleHobbiesByUserId");
    }
  }

  async updateHobby(
    id: string,
    hobbyData: Partial<NewHobby>
  ): Promise<ApiResponse<Hobby | null>> {
    try {
      const hobby = await hobbiesRepository.update(id, hobbyData);
      if (!hobby) {
        return {
          success: false,
          error: "Hobby not found",
        };
      }
      return this.success(hobby, "Hobby updated successfully");
    } catch (error) {
      return this.handleError(error, "updateHobby");
    }
  }

  async deleteHobby(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await hobbiesRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: "Hobby not found",
        };
      }
      return this.success(true, "Hobby deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteHobby");
    }
  }

  async getAllHobbies(): Promise<ApiResponse<Hobby[]>> {
    try {
      const hobbies = await hobbiesRepository.findAll();
      return this.success(hobbies);
    } catch (error) {
      return this.handleError(error, "getAllHobbies");
    }
  }

  async getVisibleHobbies(): Promise<ApiResponse<Hobby[]>> {
    try {
      const hobbies = await hobbiesRepository.findVisible();
      return this.success(hobbies);
    } catch (error) {
      return this.handleError(error, "getVisibleHobbies");
    }
  }
}
