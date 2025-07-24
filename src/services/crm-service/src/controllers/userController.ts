import { Request, Response, NextFunction } from 'express'
import userModel from '../models/userModel'
import { UserDTO } from '../dtos/userDTO'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body
    const newUserId = await userModel.createUser(userData)
    res.status(201).json({ id: newUserId, message: 'User created successfully' })
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.getAllUsers()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const user = await userModel.getUserById(id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    const user = await userModel.getUserByEmail(email)

    if (!user) {
      res.status(404).json({ message: 'User not found' })
    } else {
      res.json(user)
    }
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const data = req.body
    const result = await userModel.updateUser(id, data)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const result = await userModel.deleteUser(id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export default {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
}
