import { Request, Response, NextFunction } from 'express';
import opportunityModel from '../models/opportunityModel';

const createOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunityData = req.body;
    const newId = await opportunityModel.createOpportunity(opportunityData);
    res.status(201).json({ id: newId, message: 'Opportunity created successfully' });
  } catch (error) {
    next(error);
  }
};

const getAllOpportunities = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await opportunityModel.getAllOpportunities();
    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

const getOpportunityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const opportunity = await opportunityModel.getOpportunityById(id);
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

const updateOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await opportunityModel.updateOpportunity(id, data);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await opportunityModel.deleteOpportunity(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
};
