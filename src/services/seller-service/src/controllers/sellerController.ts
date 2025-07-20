import { Request, Response } from 'express';
import sellerModel from '../models/sellerModel';
import { Seller } from '../types/seller';

const createSeller = async (req: Request, res: Response) => {
  try {
    const data = req.body as Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>;
    const id = await sellerModel.createSeller(data);
    res.status(201).json({ message: 'Seller created successfully', id });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

const getAllSellers = async (_req: Request, res: Response) => {
  try {
    const sellers = await sellerModel.getAllSellers();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const getSellerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const seller = await sellerModel.getSellerById(id);
    res.status(200).json(seller);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

const getSellerByFirebaseUid = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.params.firebaseUid;
    const seller = await sellerModel.getSellerByFirebaseUid(firebaseUid);
    res.status(200).json(seller);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user?.uid) {
      res.status(401).json({ message: 'Unauthorized: Missing user info' });
      return;
    }

    const seller = await sellerModel.getSellerByFirebaseUid(user?.uid);
    res.status(200).json(seller);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

const updateSeller = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body as Partial<Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>>;
    const result = await sellerModel.updateSeller(id, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

const deleteSeller = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await sellerModel.deleteSeller(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export default {
  createSeller,
  getAllSellers,
  getSellerById,
  getSellerByFirebaseUid,
  getMe,
  updateSeller,
  deleteSeller,
};
