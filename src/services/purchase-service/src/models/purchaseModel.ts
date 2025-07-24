import admin from 'firebase-admin';
import { PurchaseData, PurchaseStatus } from '../types/Purchase';
import PurchaseDTO from '../dtos/purchaseDTO';

const db = admin.firestore();

// Generate invoice number
const generateInvoiceNo = async (): Promise<string> => {
  const counterRef = db.collection('counters').doc('purchaseInvoice');
  let invoiceNo = '';

  await db.runTransaction(async (t) => {
    const doc = await t.get(counterRef);
    let currentCounter = 0;

    if (doc.exists) {
      currentCounter = doc.data()?.counter || 0;
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');

    const newCounter = currentCounter + 1;
    const counterStr = String(newCounter).padStart(4, '0');

    invoiceNo = `INV${y}${m}${d}-${counterStr}`;

    t.set(counterRef, { counter: newCounter }, { merge: true });
  });

  return invoiceNo;
};

// CREATE
const addPurchaseWithTransaction = async (rawData: PurchaseData): Promise<string> => {
  if (!rawData.invoiceNo) {
    rawData.invoiceNo = await generateInvoiceNo();
  }

  const {
    supplierId,
    productId,
    quantity,
    unitPrice,
    status = 'pending',
    createdBy,
    approvedBy,
    invoiceNo,
    notes
  } = rawData;

  const validStatuses: PurchaseStatus[] = ['pending', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status for purchase');
  }

  const dto = new PurchaseDTO(
    supplierId,
    productId,
    quantity,
    unitPrice,
    status,
    createdBy,
    approvedBy,
    invoiceNo,
    notes
  );

  if (!PurchaseDTO.validate(dto as PurchaseData)) {
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
      createdAt: admin.firestore.Timestamp.fromDate(dto.createdAt),
    });

    t.set(stockLogRef, {
      productId: dto.productId,
      changeType: 'add',
      quantity: dto.quantity,
      timestamp: admin.firestore.Timestamp.fromDate(dto.createdAt),
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
const update = async (id: string, updateData: Partial<PurchaseData>): Promise<void> => {
  if (updateData.status && !PurchaseDTO.validateUpdate(updateData)) {
    throw new Error('Invalid or missing status for purchase update');
  }

  const updateFields: any = {
    ...updateData,
    updatedAt: new Date(),
  };

  await db.collection('purchases').doc(id).update(updateFields);
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
