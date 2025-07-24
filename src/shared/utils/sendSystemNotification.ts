import notificationModel from 'services/notification-service/src/models/notificationModel'
import { NotificationType } from 'services/notification-service/src/types/Notification'

/**
 * Sends a system notification to a user.
 * @param userId - The ID of the user to send the notification to. If null, the notification is sent without a specific user.
 * @param title - The title of the notification.
 * @param message - The message content of the notification.
 * @param type - The type of notification (e.g., 'info', 'warning', 'success', 'error').
 */
export const sendSystemNotification = async (
  userId: string | null,
  title: string,
  message: string,
  type: NotificationType
): Promise<void> => {
  try {
    await notificationModel.createNotification({
      title,
      message,
      type,
      userId,
      source: 'system',
    })
  } catch (error) {
    console.error('Failed to send system notification:', error)
  }
}
