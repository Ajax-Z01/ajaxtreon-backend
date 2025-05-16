export interface Product {
  id: string
  name: string
  price: number
  stock: number
  categoryId: string
  description?: string
  imageUrl?: string
  sku?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  createdBy: string
}
