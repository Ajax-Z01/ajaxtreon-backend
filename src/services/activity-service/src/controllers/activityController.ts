import { Request, Response, NextFunction } from 'express';
import activityModel from '../models/activityModel';

const validTypes = ['lead', 'contact', 'opportunity'] as const;
type RelatedToType = typeof validTypes[number];

const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityData = req.body;
    const id = await activityModel.createActivity(activityData);
    res.status(201).json({ id, message: 'Activity created successfully' });
  } catch (error) {
    next(error);
  }
};

const getAllActivities = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const activities = await activityModel.getAllActivities();
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const activity = await activityModel.getActivityById(id);
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

const getActivitiesByRelatedTo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params;

    if (!validTypes.includes(type as RelatedToType)) {
      res.status(400).json({ message: 'Invalid relatedTo type' });
    } else {
      const activities = await activityModel.getActivitiesByRelatedTo(type as RelatedToType, id);
      res.json(activities);
    }
  } catch (error) {
    next(error);
  }
};

const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await activityModel.updateActivity(id, data);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await activityModel.deleteActivity(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createActivity,
  getAllActivities,
  getActivityById,
  getActivitiesByRelatedTo,
  updateActivity,
  deleteActivity,
};
