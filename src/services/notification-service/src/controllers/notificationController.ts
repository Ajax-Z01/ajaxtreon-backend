import { Response, Request } from 'express'
import notificationService from '../services/notificationService'

const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = await notificationService.create(req.body)
    res.status(201).json({ success: true, id })
  } catch (error) {
    console.error('Error creating notification:', error)
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
  }
}

const getAllNotifications = async (_req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await notificationService.getAll()
    res.json({ success: true, data: notifications })
  } catch (error) {
    console.error('Error getting notifications:', error)
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
  }
}

const getNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId
    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' })
      return
    }

    const notifications = await notificationService.getByUser(userId)
    res.json({ success: true, data: notifications })
  } catch (error) {
    console.error('Error getting user notifications:', error)
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
  }
}


const getMyNotifications = async (req: Request, res: any): Promise<void> => {
  try {
    const userId = res.locals.user?.uid
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized: Missing user ID' })
      return
    }   
    const notifications = await notificationService.getByUser(userId)
    res.json({ success: true, data: notifications })
  } catch (error) {
    console.error('Error getting my notifications:', error)
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
  }
}

const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ success: false, message: 'Notification ID is required' })
      return
    }

    await notificationService.markAsRead(id)
    res.json({ success: true, message: 'Notification marked as read' })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
  }
}

const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ success: false, message: 'Notification ID is required' })
      return
    }

    await notificationService.remove(id)
    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) {
    console.error('Error deleting notification:', error)
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export default {
  createNotification,
  getAllNotifications,
  getNotificationsByUser,
  getMyNotifications,
  markNotificationRead,
  deleteNotification,
}
