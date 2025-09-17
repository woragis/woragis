// Biography types
export interface Biography {
  id: string;
  userId: string;
  featuredBiography?: string | null;
  fullBiography?: string | null;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewBiography {
  userId: string;
  featuredBiography?: string | null;
  fullBiography?: string | null;
  visible?: boolean;
}
