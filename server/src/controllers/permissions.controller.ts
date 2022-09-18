import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const permissions = await prisma.permissionLevel.findMany({
      where: {
        tenantId,
      },
    });
    res.json(permissions);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
