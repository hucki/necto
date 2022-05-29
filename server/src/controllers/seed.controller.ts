import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

/**
 * seed permissionLevels
 */
 export const permissionLevels = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const permissionLevels = await prisma.permissionLevel.createMany({
      data: [
        {
          displayName: 'admin',
          description: 'admin role',
          tenantId
        },
        {
          displayName: 'employee',
          description: 'employee role',
          tenantId
        },
        {
          displayName: 'planer',
          description: 'planer role',
          tenantId
        },
      ]
    })
    res.json(permissionLevels);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};


