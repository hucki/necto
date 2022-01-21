import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

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
    const createdSettings = await prisma.appSettings.create({
      data: {
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
