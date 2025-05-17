import type { Product } from '../types/product';

export default class ProductDTO {
  name: Product['name'];
  price: Product['price'];
  stock: Product['stock'];
  categoryId: Product['categoryId'];
  createdBy: Product['createdBy'];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: Product['name'],
    price: Product['price'],
    stock: Product['stock'],
    categoryId: Product['categoryId'],
    createdBy: Product['createdBy'],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.categoryId = categoryId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Validate product data
  static validate(data: Partial<ProductDTO>): boolean {
    return (
      typeof data.name === 'string' && data.name.trim() !== '' &&
      typeof data.price === 'number' && data.price >= 0 &&
      typeof data.stock === 'number' && data.stock >= 0 &&
      typeof data.categoryId === 'string' && data.categoryId.trim() !== '' &&
      typeof data.createdBy === 'string' && data.createdBy.trim() !== ''
    );
  }

  // Transform data to Firestore format
  static transformToFirestore(data: ProductDTO): Record<string, any> {
    return {
      name: data.name.trim(),
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId.trim(),
      createdBy: data.createdBy.trim(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : null,
    };
  }

  // Transform data from Firestore to DTO format
  static transformFromFirestore(doc: any): ProductDTO {
    return new ProductDTO(
      doc.name,
      doc.price,
      doc.stock,
      doc.categoryId,
      doc.createdBy,
      doc.createdAt ? new Date(doc.createdAt.seconds * 1000) : undefined,
      doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000) : undefined
    );
  }
}
