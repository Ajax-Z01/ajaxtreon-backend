import admin from 'firebase-admin';

const db = admin.firestore();

export const toTimestampRange = (startDate: string, endDate: string): { startTimestamp: admin.firestore.Timestamp; endTimestamp: admin.firestore.Timestamp } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return {
    startTimestamp: admin.firestore.Timestamp.fromDate(start),
    endTimestamp: admin.firestore.Timestamp.fromDate(end),
  };
};

export const queryByDateRange = async <T>(
  collectionName: string,
  startTimestamp: admin.firestore.Timestamp,
  endTimestamp: admin.firestore.Timestamp,
  additionalFilters?: [string, FirebaseFirestore.WhereFilterOp, any][]
): Promise<T[]> => {
  let ref = db.collection(collectionName)
    .where('createdAt', '>=', startTimestamp)
    .where('createdAt', '<=', endTimestamp);

  if (additionalFilters) {
    additionalFilters.forEach(([field, op, value]) => {
      ref = ref.where(field, op, value);
    });
  }

  const snapshot = await ref.get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => doc.data() as T);
};

export const dbInstance = db;
