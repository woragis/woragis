import { ideasRepository } from "@/server/repositories/money";
import type {
  Idea,
  NewIdea,
  IdeaFilters,
  IdeaOrderUpdate,
  ApiResponse,
} from "@/types";
import { BaseService } from "../base.service";

export class IdeasService extends BaseService {
  async getAllIdeas(userId?: string): Promise<ApiResponse<Idea[]>> {
    try {
      const ideas = await ideasRepository.findAll(userId);
      return this.success(ideas);
    } catch (error) {
      return this.handleError(error, "getAllIdeas");
    }
  }

  async getVisibleIdeas(userId?: string): Promise<ApiResponse<Idea[]>> {
    try {
      const ideas = await ideasRepository.findVisible(userId);
      return this.success(ideas);
    } catch (error) {
      return this.handleError(error, "getVisibleIdeas");
    }
  }

  async getPublicIdeas(): Promise<ApiResponse<Idea[]>> {
    try {
      const ideas = await ideasRepository.findPublic();
      return this.success(ideas);
    } catch (error) {
      return this.handleError(error, "getPublicIdeas");
    }
  }

  async getFeaturedIdeas(
    limit: number = 3,
    userId?: string
  ): Promise<ApiResponse<Idea[]>> {
    try {
      const ideas = await ideasRepository.findFeatured(limit, userId);
      return this.success(ideas);
    } catch (error) {
      return this.handleError(error, "getFeaturedIdeas");
    }
  }

  async getIdeaById(
    id: string,
    userId?: string
  ): Promise<ApiResponse<Idea | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid idea ID",
        };
      }

      const idea = await ideasRepository.findById(id, userId);
      return this.success(idea);
    } catch (error) {
      return this.handleError(error, "getIdeaById");
    }
  }

  async getIdeaBySlug(
    slug: string,
    userId?: string
  ): Promise<ApiResponse<Idea | null>> {
    try {
      if (!slug || slug.trim().length === 0) {
        return {
          success: false,
          error: "Invalid idea slug",
        };
      }

      const idea = await ideasRepository.findBySlug(slug, userId);
      return this.success(idea);
    } catch (error) {
      return this.handleError(error, "getIdeaBySlug");
    }
  }

  async createIdea(
    ideaData: NewIdea,
    userId: string
  ): Promise<ApiResponse<Idea>> {
    try {
      const requiredFields: (keyof NewIdea)[] = ["title", "slug", "document"];
      const validationErrors = this.validateRequired(ideaData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      // Validate slug format (alphanumeric, hyphens, underscores)
      const slugRegex = /^[a-z0-9-_]+$/;
      if (!slugRegex.test(ideaData.slug)) {
        return {
          success: false,
          error:
            "Slug must contain only lowercase letters, numbers, hyphens, and underscores",
        };
      }

      // Check if slug already exists
      const existingIdea = await ideasRepository.findBySlug(ideaData.slug);
      if (existingIdea) {
        return {
          success: false,
          error: "An idea with this slug already exists",
        };
      }

      // Add userId to idea data
      const ideaWithUser = { ...ideaData, userId };
      const idea = await ideasRepository.create(ideaWithUser);
      return this.success(idea, "Idea created successfully");
    } catch (error) {
      return this.handleError(error, "createIdea");
    }
  }

  async updateIdea(
    id: string,
    ideaData: Partial<NewIdea>,
    userId?: string
  ): Promise<ApiResponse<Idea | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid idea ID",
        };
      }

      // Validate slug format if provided
      if (ideaData.slug) {
        const slugRegex = /^[a-z0-9-_]+$/;
        if (!slugRegex.test(ideaData.slug)) {
          return {
            success: false,
            error:
              "Slug must contain only lowercase letters, numbers, hyphens, and underscores",
          };
        }

        // Check if slug already exists (excluding current idea)
        const existingIdea = await ideasRepository.findBySlug(ideaData.slug);
        if (existingIdea && existingIdea.id !== id) {
          return {
            success: false,
            error: "An idea with this slug already exists",
          };
        }
      }

      const idea = await ideasRepository.update(id, ideaData, userId);
      if (!idea) {
        return {
          success: false,
          error: "Idea not found",
        };
      }

      return this.success(idea, "Idea updated successfully");
    } catch (error) {
      return this.handleError(error, "updateIdea");
    }
  }

  async deleteIdea(id: string, userId?: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid idea ID",
        };
      }

      await ideasRepository.delete(id, userId);
      return this.success(undefined, "Idea deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteIdea");
    }
  }

  async searchIdeas(
    filters: IdeaFilters,
    userId?: string
  ): Promise<ApiResponse<Idea[]>> {
    try {
      const ideas = await ideasRepository.search(filters, userId);
      return this.success(ideas);
    } catch (error) {
      return this.handleError(error, "searchIdeas");
    }
  }

  async updateIdeaOrder(
    ideaOrders: IdeaOrderUpdate[],
    userId?: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!ideaOrders || ideaOrders.length === 0) {
        return {
          success: false,
          error: "No idea orders provided",
        };
      }

      await ideasRepository.updateOrder(ideaOrders, userId);
      return this.success(undefined, "Idea order updated successfully");
    } catch (error) {
      return this.handleError(error, "updateIdeaOrder");
    }
  }

  async toggleIdeaVisibility(
    id: string,
    userId?: string
  ): Promise<ApiResponse<Idea | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid idea ID",
        };
      }

      const idea = await ideasRepository.toggleVisibility(id, userId);
      if (!idea) {
        return {
          success: false,
          error: "Idea not found",
        };
      }

      return this.success(idea, "Idea visibility toggled successfully");
    } catch (error) {
      return this.handleError(error, "toggleIdeaVisibility");
    }
  }

  async toggleIdeaFeatured(
    id: string,
    userId?: string
  ): Promise<ApiResponse<Idea | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid idea ID",
        };
      }

      const idea = await ideasRepository.toggleFeatured(id, userId);
      if (!idea) {
        return {
          success: false,
          error: "Idea not found",
        };
      }

      return this.success(idea, "Idea featured status toggled successfully");
    } catch (error) {
      return this.handleError(error, "toggleIdeaFeatured");
    }
  }

  async getIdeaStats(userId?: string): Promise<
    ApiResponse<{
      total: number;
    }>
  > {
    try {
      const total = await ideasRepository.getTotalCount(userId);

      return this.success({
        total,
      });
    } catch (error) {
      return this.handleError(error, "getIdeaStats");
    }
  }
}
