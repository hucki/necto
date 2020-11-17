import { Request, Response, NextFunction } from 'express';
import { AppSettings } from '../db/models/AppSettings';
/**
 * add App Settings
 *  @param {AppSettings} req.body
 */
export const addAppSettings = async (
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