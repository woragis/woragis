// Hobbies types
export interface Hobby {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewHobby {
  userId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  visible?: boolean;
}
