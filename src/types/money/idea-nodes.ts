import type { ideaNodes } from "@/server/db/schemas/money";

// Base types from schema
export type IdeaNode = typeof ideaNodes.$inferSelect;
export type NewIdeaNode = typeof ideaNodes.$inferInsert;

// Extended types
export interface IdeaNodeWithChats extends IdeaNode {
  chatCount?: number;
}

export interface IdeaNodeFilters {
  ideaId?: string;
  type?: string;
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Canvas position update
export interface IdeaNodePositionUpdate {
  id: string;
  positionX: number;
  positionY: number;
}

// Connection management
export interface IdeaNodeConnectionUpdate {
  id: string;
  connections: string[];
}

// Form types for admin
export interface IdeaNodeFormData {
  title: string;
  content?: string;
  type: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  color?: string;
  connections: string[];
  visible: boolean;
}

// API response types
export interface IdeaNodeListResponse {
  nodes: IdeaNode[];
  total: number;
}

export interface IdeaNodeCreateRequest {
  node: Omit<NewIdeaNode, "id">;
}

export interface IdeaNodeUpdateRequest {
  id: string;
  node: Partial<NewIdeaNode>;
}

// Canvas types
export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface NodeConnection {
  from: string;
  to: string;
}
