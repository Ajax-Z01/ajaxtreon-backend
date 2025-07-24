import notificationModel from '../models/notificationModel'
import type { CreateNotificationPayload, Notification } from '../types/Notification'
import NotificationDTO from '../dtos/notificationDTO'

const create = async (payload: CreateNotificationPayload): Promise<string> => {
  const errors = NotificationDTO.validate(payload)
  if (errors.length > 0) {
    throw new Error('E_NOTIFICATION_INVALID: ' + errors.join(', '))
  }

  return await notificationModel.createNotification(payload)
}

const getAll = async (): Promise<Notification[]> => {
  return await notificationModel.getNotifications()
}

const getByUser = async (userId: string): Promise<Notification[]> => {
  return await notificationModel.getNotificationsByUser(userId)
}

const markAsRead = async (id: string): Promise<void> => {
  return await notificationModel.markNotificationAsRead(id)
}

const remove = async (id: string): Promise<void> => {
  return await notificationModel.deleteNotification(id)
}

export default {
  create,
  getAll,
  getByUser,
  markAsRead,
  remove,
}
