const admin = require('firebase-admin');
const db = admin.firestore();
const PaymentDTO = require('../dtos/paymentDTO');

// CREATE
const createPayment = async (paymentData) => {
  const errors = PaymentDTO.validate(paymentData);
  if (errors.length > 0) {
    throw new Error('Validation failed: ' + errors.join(', '));
  }

  const dto = new PaymentDTO(paymentData);
  const paymentRef = db.collection('payments').doc();

  await paymentRef.set({
    ...PaymentDTO.transformToFirestore(dto),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: null,
  });

  return paymentRef.id;
};

// READ
const getAllPayments = async () => {
  const snapshot = await db.collection('payments').get();
  return snapshot.docs.map(doc =>
    PaymentDTO.transformFromFirestore(doc.data(), doc.id)
  );
};

const getPaymentById = async (paymentId) => {
  const doc = await db.collection('payments').doc(paymentId).get();
  if (!doc.exists) {
    throw new Error('Payment not found');
  }
  return PaymentDTO.transformFromFirestore(doc.data(), doc.id);
};

// UPDATE
const updatePaymentStatus = async (paymentId, status) => {
  if (!PaymentDTO.validateUpdate(status)) {
    throw new Error('Invalid status value');
  }

  await db.collection('payments').doc(paymentId).update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { message: 'Payment status updated' };
};

// DELETE
const deletePayment = async (paymentId) => {
  await db.collection('payments').doc(paymentId).delete();
  return { message: 'Payment deleted' };
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};
