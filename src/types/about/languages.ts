// Languages types
export type Proficiency =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced"
  | "native";
export type LearningStatus =
  | "want_to_learn"
  | "learning"
  | "learned"
  | "not_interested";

export interface Language {
  id: string;
  userId: string;
  name: string;
  proficiencyLevel?:
    | "beginner"
    | "elementary"
    | "intermediate"
    | "upper_intermediate"
    | "advanced"
    | "native"
    | null;
  learningStatus: "want_to_learn" | "learning" | "learned" | "not_interested";
  yearsOfExperience?: string | null;
  description?: string | null;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewLanguage {
  userId: string;
  name: string;
  proficiencyLevel?:
    | "beginner"
    | "elementary"
    | "intermediate"
    | "upper_intermediate"
    | "advanced"
    | "native"
    | null;
  learningStatus: "want_to_learn" | "learning" | "learned" | "not_interested";
  yearsOfExperience?: string | null;
  description?: string | null;
  visible?: boolean;
}
