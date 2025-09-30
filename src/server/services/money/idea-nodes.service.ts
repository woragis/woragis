import { ideaNodesRepository } from "@/server/repositories/money";
import type {
  IdeaNode,
  NewIdeaNode,
  IdeaNodeFilters,
  IdeaNodePositionUpdate,
  ApiResponse,
} from "@/types";
import { BaseService } from "../base.service";

export class IdeaNodesService extends BaseService {
  async getAllNodes(ideaId: string): Promise<ApiResponse<IdeaNode[]>> {
    try {
      const nodes = await ideaNodesRepository.findAll(ideaId);
      return this.success(nodes);
    } catch (error) {
      return this.handleError(error, "getAllNodes");
    }
  }

  async getVisibleNodes(ideaId: string): Promise<ApiResponse<IdeaNode[]>> {
    try {
      const nodes = await ideaNodesRepository.findVisible(ideaId);
      return this.success(nodes);
    } catch (error) {
      return this.handleError(error, "getVisibleNodes");
    }
  }

  async getNodeById(
    id: string,
    ideaId?: string
  ): Promise<ApiResponse<IdeaNode | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid node ID",
        };
      }

      const node = await ideaNodesRepository.findById(id, ideaId);
      return this.success(node);
    } catch (error) {
      return this.handleError(error, "getNodeById");
    }
  }

  async createNode(nodeData: NewIdeaNode): Promise<ApiResponse<IdeaNode>> {
    try {
      const requiredFields: (keyof NewIdeaNode)[] = ["ideaId", "title"];
      const validationErrors = this.validateRequired(nodeData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const node = await ideaNodesRepository.create(nodeData);
      return this.success(node, "Node created successfully");
    } catch (error) {
      return this.handleError(error, "createNode");
    }
  }

  async updateNode(
    id: string,
    nodeData: Partial<NewIdeaNode>,
    ideaId?: string
  ): Promise<ApiResponse<IdeaNode | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid node ID",
        };
      }

      const node = await ideaNodesRepository.update(id, nodeData, ideaId);
      if (!node) {
        return {
          success: false,
          error: "Node not found",
        };
      }

      return this.success(node, "Node updated successfully");
    } catch (error) {
      return this.handleError(error, "updateNode");
    }
  }

  async deleteNode(
    id: string,
    ideaId?: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid node ID",
        };
      }

      await ideaNodesRepository.delete(id, ideaId);
      return this.success(undefined, "Node deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteNode");
    }
  }

  async updateNodePosition(
    id: string,
    position: Omit<IdeaNodePositionUpdate, "id">,
    ideaId?: string
  ): Promise<ApiResponse<IdeaNode | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid node ID",
        };
      }

      const node = await ideaNodesRepository.updatePosition(id, position, ideaId);
      if (!node) {
        return {
          success: false,
          error: "Node not found",
        };
      }

      return this.success(node, "Node position updated successfully");
    } catch (error) {
      return this.handleError(error, "updateNodePosition");
    }
  }

  async updateNodePositions(
    positions: IdeaNodePositionUpdate[],
    ideaId?: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!positions || positions.length === 0) {
        return {
          success: false,
          error: "No positions provided",
        };
      }

      await ideaNodesRepository.updatePositions(positions, ideaId);
      return this.success(undefined, "Node positions updated successfully");
    } catch (error) {
      return this.handleError(error, "updateNodePositions");
    }
  }

  async updateNodeConnections(
    id: string,
    connections: string[],
    ideaId?: string
  ): Promise<ApiResponse<IdeaNode | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid node ID",
        };
      }

      const node = await ideaNodesRepository.updateConnections(id, connections, ideaId);
      if (!node) {
        return {
          success: false,
          error: "Node not found",
        };
      }

      return this.success(node, "Node connections updated successfully");
    } catch (error) {
      return this.handleError(error, "updateNodeConnections");
    }
  }

  async toggleNodeVisibility(
    id: string,
    ideaId?: string
  ): Promise<ApiResponse<IdeaNode | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid node ID",
        };
      }

      const node = await ideaNodesRepository.toggleVisibility(id, ideaId);
      if (!node) {
        return {
          success: false,
          error: "Node not found",
        };
      }

      return this.success(node, "Node visibility toggled successfully");
    } catch (error) {
      return this.handleError(error, "toggleNodeVisibility");
    }
  }

  async searchNodes(filters: IdeaNodeFilters): Promise<ApiResponse<IdeaNode[]>> {
    try {
      const nodes = await ideaNodesRepository.search(filters);
      return this.success(nodes);
    } catch (error) {
      return this.handleError(error, "searchNodes");
    }
  }

  async getNodeStats(ideaId: string): Promise<
    ApiResponse<{
      total: number;
    }>
  > {
    try {
      const total = await ideaNodesRepository.getCountByIdea(ideaId);

      return this.success({
        total,
      });
    } catch (error) {
      return this.handleError(error, "getNodeStats");
    }
  }
}
