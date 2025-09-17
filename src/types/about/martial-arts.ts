// Martial Arts types
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

export interface MartialArt {
  id: string;
  userId: string;
  name: string;
  knowledgeLevel?: "beginner" | "intermediate" | "advanced" | "expert" | null;
  learningStatus: "want_to_learn" | "learning" | "learned" | "not_interested";
  grade?: string | null;
  belt?: string | null;
  yearsOfExperience?: string | null;
  description?: string | null;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewMartialArt {
  userId: string;
  name: string;
  knowledgeLevel?: "beginner" | "intermediate" | "advanced" | "expert" | null;
  learningStatus: "want_to_learn" | "learning" | "learned" | "not_interested";
  grade?: string | null;
  belt?: string | null;
  yearsOfExperience?: string | null;
  description?: string | null;
  visible?: boolean;
}
