import admin from 'firebase-admin';
import { PurchaseData, PurchaseStatus } from '../types/purchase';
import PurchaseDTO from '../dtos/purchaseDTO';

const db = admin.firestore();

// CREATE
const addPurchaseWithTransaction = async (rawData: PurchaseData): Promise<string> => {
  const { supplierId, productId, quantity, status = 'pending' }: PurchaseData = rawData;

  // Ensure status is of type PurchaseStatus (one of 'pending', 'completed', 'cancelled')
  const validStatuses: PurchaseStatus[] = ['pending', 'completed', 'cancelled'];

  // Type-safe check for status being a valid PurchaseStatus
  if (!validStatuses.includes(status as PurchaseStatus)) {
    throw new Error('Invalid status for purchase');
  }

  // Initialize PurchaseDTO with the status parameter
  const dto = new PurchaseDTO(supplierId, productId, quantity, status as PurchaseStatus);

  if (!PurchaseDTO.validate(dto)) {
    throw new Error('Invalid purchase data');
  }

  const purchaseData = PurchaseDTO.transformToFirestore(dto);

  const purchaseRef = db.collection('purchases').doc();
  const productRef = db.collection('products').doc(dto.productId);
  const stockLogRef = db.collection('stock_changes').doc();

  await db.runTransaction(async (t) => {
    const productDoc = await t.get(productRef);
    if (!productDoc.exists) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();
    const newStock = productData!.stock + dto.quantity;

    t.update(productRef, { stock: newStock });

    t.set(purchaseRef, {
      ...purchaseData,
      isDeleted: false,
      createdAt: dto.createdAt,
    });

    t.set(stockLogRef, {
      product_id: dto.productId,
      change_type: 'add',
      quantity: dto.quantity,
      timestamp: dto.createdAt,
      note: 'Stock added via purchase transaction',
    });
  });

  return purchaseRef.id;
};

// READ
const getAll = async (): Promise<PurchaseData[]> => {
  const snapshot = await db.collection('purchases')
    .where('isDeleted', '!=', true)
    .get();

  return snapshot.docs.map(doc =>
    PurchaseDTO.transformFromFirestore(doc.data(), doc.id)
  );
};

// Get purchase by ID
const getById = async (id: string): Promise<PurchaseData | null> => {
  const doc = await db.collection('purchases').doc(id).get();
  const data = doc.data();

  if (!doc.exists || !data || data.isDeleted) return null;

  return PurchaseDTO.transformFromFirestore(data, doc.id);
};

// UPDATE
const update = async (id: string, updateData: { status: PurchaseStatus }): Promise<void> => {
  if (!PurchaseDTO.validateUpdate({ status: updateData.status })) {
    throw new Error('Invalid or missing status for purchase update');
  }

  await db.collection('purchases').doc(id).update({
    status: updateData.status,
    updatedAt: new Date(),
  });
};

// DELETE
const remove = async (id: string): Promise<void> => {
  await db.collection('purchases').doc(id).update({
    isDeleted: true,
    deletedAt: new Date(),
    updatedAt: new Date(),
  });
};

export default {
  addPurchaseWithTransaction,
  getAll,
  getById,
  update,
  remove,
};
