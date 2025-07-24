import admin from '@shared/firebaseAdmin'
import NotificationDTO from '../dtos/notificationDTO'
import type { Notification, CreateNotificationPayload } from '../types/Notification'

const db = admin.firestore()
const Timestamp = admin.firestore.Timestamp

function cleanObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(cleanObject)
  if (obj !== null && typeof obj === 'object') {
    if (obj instanceof Timestamp || obj instanceof Date) return obj
    const cleaned: any = {}
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined) cleaned[key] = cleanObject(value)
    })
    return cleaned
  }
  return obj
}

const createNotification = async (payload: CreateNotificationPayload): Promise<string> => {
  const dto = new NotificationDTO({
    ...payload,
    read: false,
    createdAt: Timestamp.now(),
  })

  const ref = db.collection('notifications').doc()
  await ref.set(cleanObject(NotificationDTO.toFirestore(dto)))

  return ref.id
}

const getNotificationById = async (id: string): Promise<Notification | null> => {
  const doc = await db.collection('notifications').doc(id).get()
  return doc.exists ? NotificationDTO.fromFirestore(doc) : null
}

const getNotifications = async (): Promise<Notification[]> => {
  const snapshot = await db
    .collection('notifications')
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map(doc => NotificationDTO.fromFirestore(doc))
}

const getNotificationsByUser = async (userId: string): Promise<Notification[]> => {
  const snapshot = await db
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map(doc => NotificationDTO.fromFirestore(doc))
}

const markNotificationAsRead = async (id: string): Promise<void> => {
  await db.collection('notifications').doc(id).update({ read: true })
}

const deleteNotification = async (id: string): Promise<void> => {
  await db.collection('notifications').doc(id).delete()
}

export default {
  createNotification,
  getNotificationById,
  getNotifications,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification,
}
