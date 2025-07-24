import admin from 'firebase-admin';
import { PaymentData, PaymentStatus } from '../types/Payment';
import PaymentDTO from '../dtos/paymentDTO';
import { sendSystemNotification } from '@shared/utils/sendSystemNotification';

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
  });

  return paymentRef.id;
};

// READ
const getAllPayments = async (): Promise<(PaymentData & { id: string })[]> => {
  const snapshot = await db.collection('payments').get();
  return snapshot.docs.map(doc =>
    PaymentDTO.transformFromFirestore(doc.data(), doc.id)
  );
};

const getPaymentById = async (paymentId: string): Promise<PaymentData & { id: string }> => {
  const doc = await db.collection('payments').doc(paymentId).get();
  if (!doc.exists) {
    throw new Error('Payment not found');
  }
  const data = doc.data();
  if (!data) {
    throw new Error('Payment data is undefined');
  }
  return PaymentDTO.transformFromFirestore(data, doc.id);
};

// UPDATE STATUS ONLY
const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus
): Promise<{ message: string }> => {
  if (!PaymentDTO.validateUpdate(status)) {
    throw new Error('Invalid status value');
  }

  const paymentDocRef = db.collection('payments').doc(paymentId);
  const paymentSnap = await paymentDocRef.get();

  if (!paymentSnap.exists) {
    throw new Error('Payment not found');
  }

  const paymentData = paymentSnap.data() as PaymentData;

  await paymentDocRef.update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const title = 'Status Pembayaran Diperbarui';
  let message = '';

  switch (status) {
    case 'paid':
      message = `Pembayaran sebesar Rp${paymentData.amount} telah berhasil.`;
      break;
    case 'failed':
      message = `Pembayaran sebesar Rp${paymentData.amount} gagal. Silakan coba lagi.`;
      break;
    case 'cancelled':
      message = `Pembayaran sebesar Rp${paymentData.amount} telah dibatalkan.`;
      break;
    case 'pending':
      message = `Menunggu penyelesaian pembayaran sebesar Rp${paymentData.amount}.`;
      break;
    default:
      message = `Status pembayaran berubah menjadi ${status}.`;
  }

  await sendSystemNotification(paymentData.userId || null, title, message, 'info');

  return { message: 'Payment status updated' };
};

// UPDATE MULTIPLE FIELDS (status, note, paidAt, redirectUrl)
const updatePayment = async (
  paymentId: string,
  updateData: Partial<Pick<PaymentData, 'status' | 'note' | 'paidAt' | 'redirectUrl'>>
): Promise<{ message: string }> => {
  const updates: any = {};

  if (updateData.status) {
    if (!PaymentDTO.validateUpdate(updateData.status)) {
      throw new Error('Invalid status value');
    }
    updates.status = updateData.status;
  }

  if (updateData.note !== undefined) {
    if (updateData.note !== null && typeof updateData.note !== 'string') {
      throw new Error('Note must be a string or null');
    }
    updates.note = updateData.note;
  }

  if (updateData.paidAt !== undefined) {
    if (
      updateData.paidAt !== null &&
      !(updateData.paidAt instanceof Date || typeof updateData.paidAt === 'string')
    ) {
      throw new Error('paidAt must be a Date, string, or null');
    }
    updates.paidAt =
      updateData.paidAt && typeof updateData.paidAt === 'string'
        ? new Date(updateData.paidAt)
        : updateData.paidAt;
  }

  if (updateData.redirectUrl !== undefined) {
    if (updateData.redirectUrl !== null && typeof updateData.redirectUrl !== 'string') {
      throw new Error('redirectUrl must be a string or null');
    }
    updates.redirectUrl = updateData.redirectUrl;
  }

  updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await db.collection('payments').doc(paymentId).update(updates);

  return { message: 'Payment updated' };
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
  updatePayment,
  deletePayment,
};
