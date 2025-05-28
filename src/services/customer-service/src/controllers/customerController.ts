import { Request, Response } from 'express';
import customerModel from '../models/customerModel';
import { Customer } from '../types/customer';

const createCustomer = async (req: Request, res: Response) => {
  try {
    const data = req.body as Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
    const id = await customerModel.createCustomer(data);
    res.status(201).json({ message: 'Customer created successfully', id });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await customerModel.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const customer = await customerModel.getCustomerById(id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

const getCustomerByFirebaseUid = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid;
    const customer = await customerModel.getCustomerByFirebaseUid(uid);
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body as Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;
    const result = await customerModel.updateCustomer(id, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await customerModel.deleteCustomer(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export default {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByFirebaseUid,
  updateCustomer,
  deleteCustomer,
};
