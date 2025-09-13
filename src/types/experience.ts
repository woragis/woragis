export interface Experience {
  id: string;
  userId: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  icon: string;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewExperience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements?: string[];
  technologies?: string[];
  icon?: string;
  order?: number;
  visible?: boolean;
}

export interface UpdateExperience {
  title?: string;
  company?: string;
  period?: string;
  location?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
  icon?: string;
  order?: number;
  visible?: boolean;
}

export interface ExperienceFormData {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  icon: string;
  order: number;
  visible: boolean;
}
