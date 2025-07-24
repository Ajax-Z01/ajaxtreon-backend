import express, { Router } from 'express'
import contactController from '../controllers/contactController'
import { authenticateUser, authorizeAdmin } from '@shared/middlewares/authMiddleware'

const router: Router = express.Router()

// Public route: get contacts by leadId
router.get('/lead/:leadId', contactController.getContactsByLeadId)

// Authenticated routes
router.use(authenticateUser)

// Get all contacts
router.get('/', contactController.getAllContacts)

// Get contact by ID
router.get('/:id', contactController.getContactById)

// Update contact
router.put('/:id', contactController.updateContact)

// Authenticated + admin only routes
router.use(authorizeAdmin)

// Create contact
router.post('/', contactController.createContact)

// Delete contact
router.delete('/:id', contactController.deleteContact)

export default router
