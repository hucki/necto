import { Request, Response, NextFunction } from 'express';
import { UserSettings } from '../db/models/UserSettings';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

/**
 * add User Settings
 *  @param {UserSettings} req.body
 */
export const addUserSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdSettings = await UserSettings.create({
      tenantId: tenantId,
      ...req.body,
    });
    res.json(createdSettings);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};