import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

/**
 * get all Cancellation Reasons
 */
export const getAllCancellationReasons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cancellationReasons = await prisma.cancellationReason.findMany();
    res.json(cancellationReasons);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add Event Cancellation Reason
 *  @param {CancellationReason} req.body
 */
export const addCancellationReason = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdCancellationReason = await prisma.cancellationReason.create({
      data: {
        id: req.body.id,
        description: req.body.description,
        tenantId: tenantId,
      },
    });
    res.json(createdCancellationReason);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update Cancellation Reason
 *  @param {CancellationReason} req.body
 */
export const updateCancellationReason = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedCancellationReason = await prisma.cancellationReason.update({
      where: {
        id: req.body.id,
      },
      data: {
        description: req.body.description,
        tenantId: tenantId,
      },
    });
    res.json(updatedCancellationReason);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
