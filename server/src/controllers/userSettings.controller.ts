import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
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
    const createdSettings = await prisma.userSettings.create({
      data: {
        tenantId: tenantId,
        ...req.body,
      },
    });
    res.json(createdSettings);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
/**
 * update User Settings
 *  @param {UserSettings} req.body
 */
export const updateUserSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedSettings = await prisma.userSettings.update({
      where: {
        id: req.body.id,
      },
      data: {
        tenantId: tenantId,
        ...req.body,
      },
    });
    res.json(updatedSettings);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
