// Instruments types
export type KnowledgeLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";
export type LearningStatus =
  | "want_to_learn"
  | "learning"
  | "learned"
  | "not_interested";

export interface Instrument {
  id: string;
  userId: string;
  name: string;
  knowledgeLevel?: "beginner" | "intermediate" | "advanced" | "expert" | null;
  learningStatus: "want_to_learn" | "learning" | "learned" | "not_interested";
  yearsOfExperience?: string | null;
  description?: string | null;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewInstrument {
  userId: string;
  name: string;
  knowledgeLevel?: "beginner" | "intermediate" | "advanced" | "expert" | null;
  learningStatus: "want_to_learn" | "learning" | "learned" | "not_interested";
  yearsOfExperience?: string | null;
  description?: string | null;
  visible?: boolean;
}
