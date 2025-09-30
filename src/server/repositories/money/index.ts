export * from "./ideas.repository";
export * from "./idea-nodes.repository";
export * from "./ai-chats.repository";

// Export instances
import { IdeasRepository } from "./ideas.repository";
import { IdeaNodesRepository } from "./idea-nodes.repository";
import { AiChatsRepository } from "./ai-chats.repository";

export const ideasRepository = new IdeasRepository();
export const ideaNodesRepository = new IdeaNodesRepository();
export const aiChatsRepository = new AiChatsRepository();
