import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { WaitingPreference } from '@prisma/client';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

/**
 * get all WaitingPreferences
 */
export const getAllWaitingPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const waitingPreferences = await prisma.waitingPreference.findMany({
      include: {
        _count: {
          select: { patients: true },
        },
      },
    });
    res.json(waitingPreferences);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add Waiting Preference
 *  @param {WaitingPreference} req.body
 */
export const addWaitingPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdWaitingPreferences = await prisma.waitingPreference.create({
      data: {
        key: req.body.key,
        label: req.body.label,
        tenantId: tenantId,
      },
    });
    res.json(createdWaitingPreferences);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update Waiting Preferences
 *  @param {WaitingPreference} req.body
 */
export const updateWaitingPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedWaitingPreferences = await prisma.waitingPreference.update({
      where: {
        key: req.body.key,
      },
      data: {
        label: req.body.label,
        tenantId: tenantId,
      },
    });
    res.json(updatedWaitingPreferences);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * delete Waiting Preferencs
 *  @param {string} req.params.key
 */
export const deleteWaitingPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedWaitingPreferences = await prisma.waitingPreference.delete({
      where: {
        key: req.params.key,
      },
    });
    res.json(deletedWaitingPreferences);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
