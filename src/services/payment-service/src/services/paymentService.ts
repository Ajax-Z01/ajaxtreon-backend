import midtransClient from '../libs/midtransClient';
import type { CreateTransactionPayload } from '../types/payment';

export async function createTransaction(payload: CreateTransactionPayload) {
  try {
    const result = await midtransClient.postTransaction(payload);
    return result;
  } catch (error: any) {
    console.error('Payment Service - Midtrans Error:', error.response?.data || error.message);
    throw new Error('Failed to create transaction in payment service');
  }
}
