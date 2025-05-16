export interface Category {
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  isActive?: boolean;
  slug?: string;
}
