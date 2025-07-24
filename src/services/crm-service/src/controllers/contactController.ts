import { Request, Response, NextFunction } from 'express'
import contactModel from '../models/contactModel'

const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactId = await contactModel.createContact(req.body)
    res.status(201).json({ id: contactId, message: 'Contact created successfully' })
  } catch (error) {
    next(error)
  }
}

const getAllContacts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactModel.getAllContacts()
    res.status(200).json(contacts)
  } catch (error) {
    next(error)
  }
}

const getContactById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await contactModel.getContactById(req.params.id)
    res.status(200).json(contact)
  } catch (error) {
    next(error)
  }
}

const getContactsByLeadId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactModel.getContactsByLeadId(req.params.leadId)
    res.status(200).json(contacts)
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await contactModel.updateContact(req.params.id, req.body)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await contactModel.deleteContact(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export default {
  createContact,
  getAllContacts,
  getContactById,
  getContactsByLeadId,
  updateContact,
  deleteContact,
}
