import { Timestamp, DocumentSnapshot } from 'firebase-admin/firestore'
import type { Notification, NotificationType, CreateNotificationPayload } from '../types/notification'

class NotificationDTO {
  id?: string
  title: string
  message: string
  type: NotificationType
  userId?: string | null
  read: boolean
  createdAt: Timestamp

  constructor(data: {
    id?: string
    title: string
    message: string
    type: NotificationType
    userId?: string | null
    read?: boolean
    createdAt?: Timestamp
  }) {
    this.id = data.id
    this.title = data.title
    this.message = data.message
    this.type = data.type
    this.userId = data.userId ?? null
    this.read = data.read ?? false
    this.createdAt = data.createdAt ?? Timestamp.now()
  }

  static fromFirestore(doc: DocumentSnapshot): NotificationDTO {
    const data = doc.data() ?? {}

    return new NotificationDTO({
      id: doc.id,
      title: String(data.title ?? ''),
      message: String(data.message ?? ''),
      type: ['info', 'warning', 'success', 'error'].includes(data.type)
        ? data.type
        : 'info',
      userId: data.userId ?? null,
      read: Boolean(data.read),
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
    })
  }

  static toFirestore(dto: NotificationDTO): Notification {
    return {
      title: dto.title,
      message: dto.message,
      type: dto.type,
      userId: dto.userId ?? null,
      read: dto.read,
      createdAt: dto.createdAt,
    }
  }

  static validate(payload: CreateNotificationPayload): string[] {
    const errors: string[] = []

    if (!payload.title || typeof payload.title !== 'string') {
      errors.push('title is required and must be a string')
    }

    if (!payload.message || typeof payload.message !== 'string') {
      errors.push('message is required and must be a string')
    }

    const allowedTypes: NotificationType[] = ['info', 'warning', 'success', 'error']
    if (!allowedTypes.includes(payload.type)) {
      errors.push('type must be one of info, warning, success, or error')
    }

    if (payload.userId && typeof payload.userId !== 'string') {
      errors.push('userId must be a string if provided')
    }

    return errors
  }
}

export default NotificationDTO
