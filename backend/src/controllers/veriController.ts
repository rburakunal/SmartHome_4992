import { Request, Response } from 'express';
import SensorData from '../models/SensorData';

export const getAllData = async (_req: Request, res: Response) => {
  const data = await SensorData.find().sort({ timestamp: -1 });
  res.json(data);
};

export const getDataById = async (req: Request, res: Response) => {
  const data = await SensorData.findById(req.params.id);
  if (!data) return res.status(404).json({ message: "Bulunamadı" });
  res.json(data);
};

export const createData = async (req: Request, res: Response) => {
  const { topic, value } = req.body;
  const newData = new SensorData({ topic, value });
  const saved = await newData.save();
  res.status(201).json(saved);
};

export const deleteData = async (req: Request, res: Response) => {
  const deleted = await SensorData.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Bulunamadı" });
  res.json({ message: "Silindi" });
};
