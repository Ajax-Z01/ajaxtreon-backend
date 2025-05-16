export default class CategoryDTO {
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  slug?: string;

  constructor(
    name: string,
    description: string,
    createdBy: string,
    createdAt: Date,
    updatedAt?: Date,
    isActive: boolean = true,
    slug?: string
  ) {
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
    this.slug = slug;
  }

  static validate(data: Partial<CategoryDTO>): boolean {
    return (
      typeof data.name === 'string' && data.name.trim() !== '' &&
      typeof data.description === 'string' && data.description.trim() !== '' &&
      typeof data.createdBy === 'string' && data.createdBy.trim() !== '' &&
      data.createdAt instanceof Date &&
      (data.updatedAt === undefined || data.updatedAt instanceof Date) &&
      (data.isActive === undefined || typeof data.isActive === 'boolean') &&
      (data.slug === undefined || typeof data.slug === 'string')
    );
  }

  static transformToFirestore(data: CategoryDTO): Record<string, any> {
    return {
      name: data.name.trim(),
      description: data.description.trim(),
      createdBy: data.createdBy.trim(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt || null,
      isActive: data.isActive,
      slug: data.slug || null,
    };
  }

  static transformFromFirestore(doc: any): CategoryDTO {
    return new CategoryDTO(
      doc.name,
      doc.description,
      doc.createdBy,
      doc.createdAt.toDate ? doc.createdAt.toDate() : new Date(doc.createdAt),
      doc.updatedAt ? (doc.updatedAt.toDate ? doc.updatedAt.toDate() : new Date(doc.updatedAt)) : undefined,
      doc.isActive !== undefined ? doc.isActive : true,
      doc.slug || undefined
    );
  }
}
