export * from "./ideas.service";
export * from "./idea-nodes.service";
export * from "./ai-chats.service";

// Export instances
import { IdeasService } from "./ideas.service";
import { IdeaNodesService } from "./idea-nodes.service";
import { AiChatsService } from "./ai-chats.service";

export const ideasService = new IdeasService();
export const ideaNodesService = new IdeaNodesService();
export const aiChatsService = new AiChatsService();
