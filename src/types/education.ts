import type {
  education,
  educationTypeEnum,
  degreeLevelEnum,
} from "@/server/db/schemas/education";

// Education type enum
export type EducationType = (typeof educationTypeEnum.enumValues)[number];

// Degree level enum
export type DegreeLevel = (typeof degreeLevelEnum.enumValues)[number];

// Base types from schema
export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

// Extended types
export interface EducationWithSkills extends Omit<Education, "skills"> {
  skills?: string[];
}

export interface EducationFilters {
  visible?: boolean;
  search?: string;
  type?: EducationType;
  degreeLevel?: DegreeLevel;
  institution?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface EducationFormData {
  title: string;
  institution: string;
  description?: string;
  type: EducationType;
  degreeLevel?: DegreeLevel;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  completionDate?: Date;
  grade?: string;
  credits?: number;
  certificateId?: string;
  issuer?: string;
  validityPeriod?: string;
  pdfDocument?: string;
  verificationUrl?: string;
  skills?: string[];
  order: number;
  visible: boolean;
}

// API response types
export interface EducationListResponse {
  education: Education[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface EducationCreateRequest {
  education: NewEducation;
}

export interface EducationUpdateRequest {
  id: string;
  education: Partial<NewEducation>;
}

// Upload types
export interface EducationUploadRequest {
  educationId: string;
  file: File;
  category: "education-document";
}
