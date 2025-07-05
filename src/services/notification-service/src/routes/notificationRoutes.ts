import express, { Router } from 'express'
import notificationController from '../controllers/notificationController'
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware'

const router: Router = express.Router()

// Semua user yang sudah login bisa lihat notifikasi mereka sendiri
router.use(authenticateUser)

// Buat notifikasi baru (biasanya admin atau service internal yang bisa)
router.post('/', authorizeAdmin, notificationController.createNotification)

// Dapatkan semua notifikasi admin (hanya admin)
router.get('/', authorizeAdmin, notificationController.getAllNotifications)

// Dapatkan notifikasi untuk user yang sedang login
router.get('/me', notificationController.getMyNotifications)

// Dapatkan notifikasi untuk user tertentu (user harus lihat notif sendiri, admin bisa juga lihat semua)
router.get('/user/:userId', notificationController.getNotificationsByUser)

// Tandai notifikasi sebagai sudah dibaca (user yang bersangkutan atau admin)
router.patch('/:id/read', notificationController.markNotificationRead)

// Hapus notifikasi (admin)
router.delete('/:id', authorizeAdmin, notificationController.deleteNotification)

export default router
