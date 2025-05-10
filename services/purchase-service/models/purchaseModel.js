const admin = require('firebase-admin');
const db = admin.firestore();
const PurchaseDTO = require('../dtos/purchaseDTO')

// CREATE
const addPurchaseWithTransaction = async (rawData) => {
  const dto = new PurchaseDTO(
    rawData.supplierId,
    rawData.productId,
    rawData.quantity,
    rawData.status || 'pending'
  );

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
    const newStock = productData.stock + dto.quantity;
    t.update(productRef, { stock: newStock });

    t.set(purchaseRef, {
      ...purchaseData,
      isDeleted: false,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    });

    t.set(stockLogRef, {
      product_id: dto.productId,
      change_type: 'add',
      quantity: dto.quantity,
      timestamp: dto.createdAt,
      note: 'Stock added via purchase transaction'
    });
  });

  return purchaseRef.id;
};

const getAll = async () => {
  const snapshot = await db.collection('purchases').where('isDeleted', '!=', true).get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { ...data, id: doc.id };
  });
};

const getById = async (id) => {
  const doc = await db.collection('purchases').doc(id).get();
  if (!doc.exists || doc.data().isDeleted) return null;
  const data = doc.data();
  return { ...data, id };
};

// UPDATE
const update = async (id, updateData) => {
  const allowedStatuses = ['pending', 'completed', 'cancelled'];

  if (
    !updateData ||
    typeof updateData.status !== 'string' ||
    !allowedStatuses.includes(updateData.status)
  ) {
    throw new Error('Invalid or missing status for purchase update');
  }

  await db.collection('purchases').doc(id).update({
    status: updateData.status,
    updatedAt: new Date(),
  });
};

// DELETE
const remove = async (id) => {
  await db.collection('purchases').doc(id).update({
    isDeleted: true,
    updatedAt: new Date(),
  });
};

module.exports = {
  addPurchaseWithTransaction,
  getAll,
  getById,
  update,
  remove
}
