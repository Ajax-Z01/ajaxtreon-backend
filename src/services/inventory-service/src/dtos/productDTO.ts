import type { Product } from '../types/product';

export default class ProductDTO {
  name: Product['name'];
  price: Product['price'];
  costPrice?: Product['costPrice'];
  stock: Product['stock'];
  categoryId: Product['categoryId'];
  description?: Product['description'];
  imageUrl?: Product['imageUrl'];
  sku?: Product['sku'];
  isActive?: Product['isActive'];
  createdBy: Product['createdBy'];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: Product['name'],
    price: Product['price'],
    stock: Product['stock'],
    categoryId: Product['categoryId'],
    createdBy: Product['createdBy'],
    costPrice?: Product['costPrice'],
    description?: Product['description'],
    imageUrl?: Product['imageUrl'],
    sku?: Product['sku'],
    isActive?: Product['isActive'],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.name = name;
    this.price = price;
    this.costPrice = costPrice;
    this.stock = stock;
    this.categoryId = categoryId;
    this.description = description;
    this.imageUrl = imageUrl;
    this.sku = sku;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static validate(data: Partial<ProductDTO>): boolean {
    return (
      typeof data.name === 'string' && data.name.trim() !== '' &&
      typeof data.price === 'number' && data.price >= 0 &&
      (data.costPrice === undefined || (typeof data.costPrice === 'number' && data.costPrice >= 0)) &&
      typeof data.stock === 'number' && data.stock >= 0 &&
      typeof data.categoryId === 'string' && data.categoryId.trim() !== '' &&
      typeof data.createdBy === 'string' && data.createdBy.trim() !== ''
    );
  }

  static transformToFirestore(data: ProductDTO): Record<string, any> {
    return {
      name: data.name.trim(),
      price: data.price,
      costPrice: data.costPrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId.trim(),
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      sku: data.sku ?? null,
      isActive: data.isActive ?? true,
      createdBy: data.createdBy.trim(),
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? null,
    };
  }

  static transformFromFirestore(doc: any): ProductDTO {
    return new ProductDTO(
      doc.name,
      doc.price,
      doc.stock,
      doc.categoryId,
      doc.createdBy,
      doc.costPrice ?? undefined,
      doc.description ?? undefined,
      doc.imageUrl ?? undefined,
      doc.sku ?? undefined,
      doc.isActive ?? true,
      doc.createdAt ? new Date(doc.createdAt.seconds * 1000) : undefined,
      doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000) : undefined
    );
  }
}
