import express, { Router } from 'express'
import activityController from '../controllers/activityController'
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware'

const router: Router = express.Router()

// Semua route memerlukan autentikasi
router.use(authenticateUser)

// Create new activity
router.post('/', activityController.createActivity)

// Get all activities
router.get('/', activityController.getAllActivities)

// Get activities related to a specific lead/contact/opportunity
router.get('/related/:type/:id', activityController.getActivitiesByRelatedTo)

// Get activity by ID
router.get('/:id', activityController.getActivityById)

// Update activity (admin only)
router.use(authorizeAdmin)
router.put('/:id', activityController.updateActivity)
router.delete('/:id', activityController.deleteActivity)

export default router
