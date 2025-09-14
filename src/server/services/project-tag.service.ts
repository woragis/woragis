import { BaseService } from "./base.service";
import { projectTagRepository } from "@/server/repositories";
import type { ApiResponse } from "@/types";
import type {
  ProjectTag,
  NewProjectTag,
  ProjectTagFilters,
  ProjectTagWithCount,
  ProjectTagOrderUpdate,
} from "@/types/project-tags";

export class ProjectTagService extends BaseService {
  async createProjectTag(
    data: NewProjectTag,
    userId: string
  ): Promise<ApiResponse<ProjectTag>> {
    try {
      const tagData = { ...data, userId };
      const tag = await projectTagRepository.create(tagData);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "createProjectTag");
    }
  }

  async getProjectTagById(id: string): Promise<ApiResponse<ProjectTag | null>> {
    try {
      const tag = await projectTagRepository.findById(id);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getProjectTagById");
    }
  }

  async getProjectTagBySlug(
    slug: string
  ): Promise<ApiResponse<ProjectTag | null>> {
    try {
      const tag = await projectTagRepository.findBySlug(slug);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getProjectTagBySlug");
    }
  }

  async updateProjectTag(
    id: string,
    data: Partial<NewProjectTag>
  ): Promise<ApiResponse<ProjectTag | null>> {
    try {
      const tag = await projectTagRepository.update(id, data);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "updateProjectTag");
    }
  }

  async deleteProjectTag(id: string): Promise<ApiResponse<void>> {
    try {
      const success = await projectTagRepository.delete(id);
      if (!success) {
        return this.error("Project tag not found", 404);
      }
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error, "deleteProjectTag");
    }
  }

  async searchProjectTags(
    filters: ProjectTagFilters,
    userId?: string
  ): Promise<ApiResponse<ProjectTag[]>> {
    try {
      const tags = await projectTagRepository.search(filters, userId);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "searchProjectTags");
    }
  }

  async getVisibleProjectTags(): Promise<ApiResponse<ProjectTag[]>> {
    try {
      const tags = await projectTagRepository.getVisibleTags();
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getVisibleProjectTags");
    }
  }

  async getProjectTagsWithCount(
    userId?: string
  ): Promise<ApiResponse<ProjectTagWithCount[]>> {
    try {
      const tags = await projectTagRepository.getTagsWithCount(userId);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getProjectTagsWithCount");
    }
  }

  async updateProjectTagOrder(
    tagOrders: ProjectTagOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    try {
      await projectTagRepository.updateOrder(tagOrders);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error, "updateProjectTagOrder");
    }
  }

  async getPopularProjectTags(
    limit?: number
  ): Promise<ApiResponse<ProjectTagWithCount[]>> {
    try {
      const tags = await projectTagRepository.getPopularTags(limit);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getPopularProjectTags");
    }
  }
}
