export default class ProductDTO {
  name: string;
  price: number;
  stock: number;
  categoryId: string;

  constructor(name: string, price: number, stock: number, categoryId: string) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.categoryId = categoryId;
  }

  // Validate product data
  static validate(data: Partial<ProductDTO>): boolean {
    return (
      typeof data.name === 'string' && data.name.trim() !== '' &&
      typeof data.price === 'number' && data.price >= 0 &&
      typeof data.stock === 'number' && data.stock >= 0 &&
      typeof data.categoryId === 'string' && data.categoryId.trim() !== ''
    );
  }

  // Transform data to Firestore format
  static transformToFirestore(data: ProductDTO): Record<string, any> {
    return {
      name: data.name.trim(),
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId.trim(),
    };
  }

  // Transform data from Firestore to DTO format
  static transformFromFirestore(doc: any): ProductDTO {
    return new ProductDTO(doc.name, doc.price, doc.stock, doc.categoryId);
  }
}
