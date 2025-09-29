import { EducationRepository } from "@/server/repositories/education.repository";
import type {
  Education,
  NewEducation,
  EducationFilters,
} from "@/types/education";

export class EducationService {
  private educationRepository: EducationRepository;

  constructor() {
    this.educationRepository = new EducationRepository();
  }

  async createEducation(
    data: NewEducation,
    userId: string
  ): Promise<{ success: boolean; data?: Education; error?: string }> {
    try {
      const educationData = {
        ...data,
        userId,
        skills: data.skills ? JSON.stringify(data.skills) : null,
      };

      const newEducation = await this.educationRepository.create(educationData);
      return { success: true, data: newEducation };
    } catch (error) {
      console.error("Error creating education:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async getEducationById(
    id: string
  ): Promise<{ success: boolean; data?: Education; error?: string }> {
    try {
      const education = await this.educationRepository.findById(id);
      if (!education) {
        return { success: false, error: "Education not found" };
      }

      const educationWithSkills = {
        ...education,
        skills: education.skills ? JSON.parse(education.skills) : undefined,
      };

      return { success: true, data: educationWithSkills as Education };
    } catch (error) {
      console.error("Error fetching education:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async searchEducation(
    filters: EducationFilters
  ): Promise<{
    success: boolean;
    data?: { education: Education[]; total: number };
    error?: string;
  }> {
    try {
      const result = await this.educationRepository.search(filters);
      
      const educationWithSkills = result.data.map(edu => ({
        ...edu,
        skills: edu.skills ? JSON.parse(edu.skills) : undefined,
      })) as Education[];

      return {
        success: true,
        data: { education: educationWithSkills, total: result.total },
      };
    } catch (error) {
      console.error("Error searching education:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async updateEducation(
    id: string,
    data: Partial<NewEducation>
  ): Promise<{ success: boolean; data?: Education; error?: string }> {
    try {
      const updateData = {
        ...data,
        skills: data.skills ? JSON.stringify(data.skills) : undefined,
      };

      const updatedEducation = await this.educationRepository.update(id, updateData);
      if (!updatedEducation) {
        return { success: false, error: "Education not found" };
      }

      const educationWithSkills = {
        ...updatedEducation,
        skills: updatedEducation.skills ? JSON.parse(updatedEducation.skills) : undefined,
      };

      return { success: true, data: educationWithSkills as Education };
    } catch (error) {
      console.error("Error updating education:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async deleteEducation(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const deleted = await this.educationRepository.delete(id);
      if (!deleted) {
        return { success: false, error: "Education not found" };
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting education:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async updateEducationOrder(
    educationOrders: { id: string; order: number }[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.educationRepository.updateOrder(educationOrders);
      return { success: true };
    } catch (error) {
      console.error("Error updating education order:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async getVisibleEducation(
    userId: string
  ): Promise<{ success: boolean; data?: Education[]; error?: string }> {
    try {
      const education = await this.educationRepository.getVisibleEducation(userId);
      
      const educationWithSkills = education.map(edu => ({
        ...edu,
        skills: edu.skills ? JSON.parse(edu.skills) : undefined,
      })) as Education[];

      return { success: true, data: educationWithSkills };
    } catch (error) {
      console.error("Error fetching visible education:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const educationService = new EducationService();
