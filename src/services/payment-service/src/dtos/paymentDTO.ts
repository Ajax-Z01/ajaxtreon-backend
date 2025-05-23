import { PaymentData, PaymentStatus } from '../types/payment';
import { Timestamp } from 'firebase-admin/firestore';

class PaymentDTO {
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: string | null;
  transactionTime: Date | null;
  transactionId: string | null;
  fraudStatus: 'accept' | 'deny' | 'challenge' | null;
  paymentType: string | null;
  vaNumber: string | null;
  pdfUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;

  constructor(data: PaymentData) {
    this.orderId = data.orderId;
    this.amount = data.amount;
    this.status = data.status ?? 'pending';
    this.method = data.method ?? null;
    this.transactionTime = data.transactionTime ? convertToDate(data.transactionTime) : null;
    this.transactionId = data.transactionId ?? null;
    this.fraudStatus = data.fraudStatus ?? null;
    this.paymentType = data.paymentType ?? null;
    this.vaNumber = data.vaNumber ?? null;
    this.pdfUrl = data.pdfUrl ?? null;
    this.createdAt = convertToDate(data.createdAt);
    this.updatedAt = data.updatedAt ? convertToDate(data.updatedAt) : null;
  }

  static validate(data: Partial<PaymentData>): string[] {
    const errors: string[] = [];

    if (!data.orderId || typeof data.orderId !== 'string') {
      errors.push('Invalid or missing orderId');
    }

    if (typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('Amount must be a positive number');
    }

    const validStatuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded', 'cancelled', 'expired', 'challenge'];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    if (data.method && typeof data.method !== 'string') {
      errors.push('Payment method must be a string if provided');
    }

    if (data.fraudStatus && !['accept', 'deny', 'challenge', null].includes(data.fraudStatus)) {
      errors.push('Invalid fraudStatus value');
    }

    return errors;
  }

  static validateUpdate(status: any): status is PaymentStatus {
    const validStatuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded', 'cancelled', 'expired', 'challenge'];
    return validStatuses.includes(status);
  }

  static transformToFirestore(dto: PaymentDTO): Omit<PaymentData, 'id'> {
    return {
      orderId: dto.orderId,
      amount: dto.amount,
      status: dto.status,
      method: dto.method,
      transactionTime: dto.transactionTime,
      transactionId: dto.transactionId,
      fraudStatus: dto.fraudStatus,
      paymentType: dto.paymentType,
      vaNumber: dto.vaNumber,
      pdfUrl: dto.pdfUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static transformFromFirestore(
    data: FirebaseFirestore.DocumentData,
    id: string
  ): PaymentData & { id: string } {
    return {
      id,
      orderId: data.orderId,
      amount: data.amount,
      status: data.status,
      method: data.method,
      transactionTime: data.transactionTime ? convertToDate(data.transactionTime) : null,
      transactionId: data.transactionId ?? null,
      fraudStatus: data.fraudStatus ?? null,
      paymentType: data.paymentType ?? null,
      vaNumber: data.vaNumber ?? null,
      pdfUrl: data.pdfUrl ?? null,
      createdAt: convertToDate(data.createdAt),
      updatedAt: data.updatedAt ? convertToDate(data.updatedAt) : null,
    };
  }
}

function convertToDate(
  value: Date | Timestamp | undefined | null
): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (isTimestamp(value)) return value.toDate();
  return new Date(value);
}

function isTimestamp(value: any): value is Timestamp {
  return value && typeof value.toDate === 'function';
}

export default PaymentDTO;
