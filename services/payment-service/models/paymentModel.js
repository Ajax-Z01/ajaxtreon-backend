const admin = require('firebase-admin');
const db = admin.firestore();
const PaymentDTO = require('../dtos/paymentDTO');

const createPayment = async (paymentData) => {
  const errors = PaymentDTO.validate(paymentData);
  if (errors.length > 0) {
    throw new Error('Validation failed: ' + errors.join(', '));
  }

  try {
    const paymentDTO = new PaymentDTO(paymentData);
    const paymentRef = db.collection('payments').doc();
    await paymentRef.set({
      ...paymentDTO,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: null
    });
    return paymentRef.id;
  } catch (error) {
    throw new Error('Error creating payment: ' + error.message);
  }
};

const getAllPayments = async () => {
  try {
    const snapshot = await db.collection('payments').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Error fetching payments: ' + error.message);
  }
};

const getPaymentById = async (paymentId) => {
  try {
    const paymentRef = db.collection('payments').doc(paymentId);
    const doc = await paymentRef.get();
    if (!doc.exists) {
      throw new Error('Payment not found');
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error('Error fetching payment: ' + error.message);
  }
};

const updatePaymentStatus = async (paymentId, status) => {
  const validStatuses = ['pending', 'paid', 'failed'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }

  try {
    const paymentRef = db.collection('payments').doc(paymentId);
    await paymentRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { message: 'Payment status updated' };
  } catch (error) {
    throw new Error('Error updating payment status: ' + error.message);
  }
};

const deletePayment = async (paymentId) => {
  try {
    const paymentRef = db.collection('payments').doc(paymentId);
    await paymentRef.delete();
    return { message: 'Payment deleted' };
  } catch (error) {
    throw new Error('Error deleting payment: ' + error.message);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment
};
