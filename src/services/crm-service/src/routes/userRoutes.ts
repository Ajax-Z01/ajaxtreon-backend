import express, { Router } from 'express'
import userController from '../controllers/userController'
import { authenticateUser, authorizeAdmin } from '@shared/middlewares/authMiddleware'

const router: Router = express.Router()

// Public route to get user by email
router.get('/email/:email', userController.getUserByEmail)

// Authenticated routes
router.use(authenticateUser)

// Get user by ID
router.get('/:id', userController.getUserById)

// Update user
router.put('/:id', userController.updateUser)

// Authenticated and authorized routes
router.use(authorizeAdmin)

// Create user
router.post('/', userController.createUser)

// Get all users
router.get('/', userController.getAllUsers)

// Delete user
router.delete('/:id', userController.deleteUser)

export default router
