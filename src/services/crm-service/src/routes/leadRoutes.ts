import express, { Router } from 'express'
import leadController from '../controllers/leadController'
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware'

const router: Router = express.Router()

// Public route: get lead by ID (optional, bisa di-restrict sesuai kebutuhan)
router.get('/:id', authenticateUser, leadController.getLeadById)

// Authenticated routes
router.use(authenticateUser)

// Get all leads (maybe admin only? Kalau iya pindahkan ke authorizeAdmin)
router.get('/', authorizeAdmin, leadController.getAllLeads)

// Update lead
router.put('/:id', leadController.updateLead)

// Authenticated + Admin only routes
router.use(authorizeAdmin)

// Create new lead
router.post('/', leadController.createLead)

// Delete lead
router.delete('/:id', leadController.deleteLead)

export default router
