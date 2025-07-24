import { Request, Response, NextFunction } from 'express'
import leadModel from '../models/leadModel'
import { LeadDTO } from '../dtos/leadDTO'

const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await leadModel.createLead(req.body)
    const newLead = await leadModel.getLeadById(id)
    res.status(201).json(newLead.toJSON())
  } catch (error) {
    next(error)
  }
}

const getAllLeads = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await leadModel.getAllLeads()
    res.json(leads.map(lead => lead.toJSON()))
  } catch (error) {
    next(error)
  }
}

const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadModel.getLeadById(req.params.id)
    res.json(lead.toJSON())
  } catch (error) {
    next(error)
  }
}

const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await leadModel.updateLead(req.params.id, req.body)
    const updatedLead = await leadModel.getLeadById(req.params.id)
    res.json(updatedLead.toJSON())
  } catch (error) {
    next(error)
  }
}

const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await leadModel.deleteLead(req.params.id)
    res.json({ message: 'Lead deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export default {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
}
