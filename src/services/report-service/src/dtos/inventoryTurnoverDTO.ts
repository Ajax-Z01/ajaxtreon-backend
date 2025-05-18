class InventoryTurnoverDTO {
  productId: string;
  productName: string;
  category?: string;
  beginningInventory: number;
  endingInventory: number;
  totalSoldQuantity: number;
  averageInventory: number;
  inventoryTurnoverRatio: number;
  turnoverDays?: number;

  constructor(
    productId: string,
    productName: string,
    category: string | undefined,
    beginningInventory: number,
    endingInventory: number,
    totalSoldQuantity: number
  ) {
    this.productId = productId;
    this.productName = productName;
    this.category = category;
    this.beginningInventory = beginningInventory;
    this.endingInventory = endingInventory;
    this.totalSoldQuantity = totalSoldQuantity;

    this.averageInventory = (beginningInventory + endingInventory) / 2;

    this.inventoryTurnoverRatio =
      this.averageInventory > 0
        ? totalSoldQuantity / this.averageInventory
        : 0;

    this.turnoverDays =
      this.inventoryTurnoverRatio > 0
        ? parseFloat((365 / this.inventoryTurnoverRatio).toFixed(2))
        : undefined;
  }

  static fromData(data: {
    productId: string;
    productName: string;
    category?: string;
    beginningInventory: number;
    endingInventory: number;
    totalSoldQuantity: number;
  }): InventoryTurnoverDTO {
    return new InventoryTurnoverDTO(
      data.productId,
      data.productName,
      data.category,
      data.beginningInventory,
      data.endingInventory,
      data.totalSoldQuantity
    );
  }
}

export { InventoryTurnoverDTO };
