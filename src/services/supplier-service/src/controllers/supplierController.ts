import { Request, Response } from 'express';
import supplierModel from '../models/supplierModel';
import { Supplier } from '../types/Supplier';

const createSupplier = async (req: Request, res: Response) => {
  try {
    const data = req.body as Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;
    const id = await supplierModel.createSupplier(data);
    res.status(201).json({ message: 'Supplier created successfully', id });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

const getAllSuppliers = async (_req: Request, res: Response) => {
  try {
    const suppliers = await supplierModel.getAllSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const getSupplierById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const supplier = await supplierModel.getSupplierById(id);
    res.status(200).json(supplier);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

const updateSupplier = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body as Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>;
    const result = await supplierModel.updateSupplier(id, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await supplierModel.deleteSupplier(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export default {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
