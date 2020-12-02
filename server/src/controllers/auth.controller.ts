import { Request, Response, NextFunction } from 'express';
import { AppSettings } from '../db/models/AppSettings';
import dotenv from 'dotenv';
dotenv.config();

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdSettings = await AppSettings.create({
      ...req.body,
    });
    res.json(createdSettings);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};