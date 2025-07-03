import { Timestamp } from 'firebase-admin/firestore'

export type NotificationType = 'info' | 'warning' | 'success' | 'error'

export interface Notification {
  id?: string
  title: string
  message: string
  type: NotificationType
  userId?: string | null
  read?: boolean
  createdAt?: Timestamp
}

export interface CreateNotificationPayload {
  title: string
  message: string
  type: NotificationType
  userId?: string | null
  source?: 'system' | 'admin'
}
