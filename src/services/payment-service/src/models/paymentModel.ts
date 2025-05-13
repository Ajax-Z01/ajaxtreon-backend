import admin from 'firebase-admin';
import { PaymentData, PaymentStatus } from '../types/payment';
import PaymentDTO from '../dtos/paymentDTO';

const db = admin.firestore();

// CREATE
const createPayment = async (paymentData: PaymentData): Promise<string> => {
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
const getAllPayments = async (): Promise<any[]> => {
  const snapshot = await db.collection('payments').get();
  return snapshot.docs.map(doc =>
    PaymentDTO.transformFromFirestore(doc.data(), doc.id)
  );
};

const getPaymentById = async (paymentId: string): Promise<any> => {
  const doc = await db.collection('payments').doc(paymentId).get();
  if (!doc.exists) {
    throw new Error('Payment not found');
  }
  // Ensure doc.data() is not undefined
  const data = doc.data();
  if (!data) {
    throw new Error('Payment data is undefined');
  }
  return PaymentDTO.transformFromFirestore(data, doc.id);
};

// UPDATE
const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus
): Promise<{ message: string }> => {
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
const deletePayment = async (paymentId: string): Promise<{ message: string }> => {
  await db.collection('payments').doc(paymentId).delete();
  return { message: 'Payment deleted' };
};

export default {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};
