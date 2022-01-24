import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      where: { tenantId },
      include: {
        employees: {
          select: {
            employee: {
              select: {
                uuid: true,
                firstName: true,
                lastName: true,
                contract: true,
              },
            },
          },
        },
      },
    });

    res.json(teams);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
