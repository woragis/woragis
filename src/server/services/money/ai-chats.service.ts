import { aiChatsRepository } from "@/server/repositories/money";
import type { ChatMessage } from "@/server/db/schemas/money/ai-chats";
import type {
  AiChat,
  NewAiChat,
  AiChatFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "../base.service";

export class AiChatsService extends BaseService {
  async getAllChats(userId?: string): Promise<ApiResponse<AiChat[]>> {
    try {
      const chats = await aiChatsRepository.findAll(userId);
      return this.success(chats);
    } catch (error) {
      return this.handleError(error, "getAllChats");
    }
  }

  async getChatsByIdeaNode(
    ideaNodeId: string,
    userId?: string
  ): Promise<ApiResponse<AiChat[]>> {
    try {
      const chats = await aiChatsRepository.findByIdeaNode(ideaNodeId, userId);
      return this.success(chats);
    } catch (error) {
      return this.handleError(error, "getChatsByIdeaNode");
    }
  }

  async getVisibleChats(userId?: string): Promise<ApiResponse<AiChat[]>> {
    try {
      const chats = await aiChatsRepository.findVisible(userId);
      return this.success(chats);
    } catch (error) {
      return this.handleError(error, "getVisibleChats");
    }
  }

  async getChatById(
    id: string,
    userId?: string
  ): Promise<ApiResponse<AiChat | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      const chat = await aiChatsRepository.findById(id, userId);
      return this.success(chat);
    } catch (error) {
      return this.handleError(error, "getChatById");
    }
  }

  async createChat(
    chatData: NewAiChat,
    userId: string
  ): Promise<ApiResponse<AiChat>> {
    try {
      const requiredFields: (keyof NewAiChat)[] = [
        "title",
        "ideaNodeId",
        "agent",
      ];
      const validationErrors = this.validateRequired(chatData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      // Initialize messages array if not provided
      if (!chatData.messages) {
        chatData.messages = [];
      }

      // Add userId to chat data
      const chatWithUser = { ...chatData, userId };
      const chat = await aiChatsRepository.create(chatWithUser);
      return this.success(chat, "Chat created successfully");
    } catch (error) {
      return this.handleError(error, "createChat");
    }
  }

  async updateChat(
    id: string,
    chatData: Partial<NewAiChat>,
    userId?: string
  ): Promise<ApiResponse<AiChat | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      const chat = await aiChatsRepository.update(id, chatData, userId);
      if (!chat) {
        return {
          success: false,
          error: "Chat not found",
        };
      }

      return this.success(chat, "Chat updated successfully");
    } catch (error) {
      return this.handleError(error, "updateChat");
    }
  }

  async deleteChat(id: string, userId?: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      await aiChatsRepository.delete(id, userId);
      return this.success(undefined, "Chat deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteChat");
    }
  }

  async addMessage(
    id: string,
    message: ChatMessage,
    userId?: string
  ): Promise<ApiResponse<AiChat | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      const chat = await aiChatsRepository.addMessage(id, message, userId);
      if (!chat) {
        return {
          success: false,
          error: "Chat not found",
        };
      }

      return this.success(chat, "Message added successfully");
    } catch (error) {
      return this.handleError(error, "addMessage");
    }
  }

  async addMessages(
    id: string,
    messages: ChatMessage[],
    userId?: string
  ): Promise<ApiResponse<AiChat | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      const chat = await aiChatsRepository.addMessages(id, messages, userId);
      if (!chat) {
        return {
          success: false,
          error: "Chat not found",
        };
      }

      return this.success(chat, "Messages added successfully");
    } catch (error) {
      return this.handleError(error, "addMessages");
    }
  }

  async clearMessages(
    id: string,
    userId?: string
  ): Promise<ApiResponse<AiChat | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      const chat = await aiChatsRepository.clearMessages(id, userId);
      if (!chat) {
        return {
          success: false,
          error: "Chat not found",
        };
      }

      return this.success(chat, "Messages cleared successfully");
    } catch (error) {
      return this.handleError(error, "clearMessages");
    }
  }

  async toggleChatVisibility(
    id: string,
    userId?: string
  ): Promise<ApiResponse<AiChat | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      const chat = await aiChatsRepository.toggleVisibility(id, userId);
      if (!chat) {
        return {
          success: false,
          error: "Chat not found",
        };
      }

      return this.success(chat, "Chat visibility toggled successfully");
    } catch (error) {
      return this.handleError(error, "toggleChatVisibility");
    }
  }

  async toggleChatArchived(
    id: string,
    userId?: string
  ): Promise<ApiResponse<AiChat | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid chat ID",
        };
      }

      const chat = await aiChatsRepository.toggleArchived(id, userId);
      if (!chat) {
        return {
          success: false,
          error: "Chat not found",
        };
      }

      return this.success(chat, "Chat archived status toggled successfully");
    } catch (error) {
      return this.handleError(error, "toggleChatArchived");
    }
  }

  async searchChats(
    filters: AiChatFilters,
    userId?: string
  ): Promise<ApiResponse<AiChat[]>> {
    try {
      const chats = await aiChatsRepository.search(filters, userId);
      return this.success(chats);
    } catch (error) {
      return this.handleError(error, "searchChats");
    }
  }

  async getChatStats(userId?: string): Promise<
    ApiResponse<{
      total: number;
    }>
  > {
    try {
      const total = await aiChatsRepository.getTotalCount(userId);

      return this.success({
        total,
      });
    } catch (error) {
      return this.handleError(error, "getChatStats");
    }
  }

  async getChatStatsByNode(
    ideaNodeId: string,
    userId?: string
  ): Promise<
    ApiResponse<{
      total: number;
    }>
  > {
    try {
      const total = await aiChatsRepository.getCountByIdeaNode(
        ideaNodeId,
        userId
      );

      return this.success({
        total,
      });
    } catch (error) {
      return this.handleError(error, "getChatStatsByNode");
    }
  }
}
