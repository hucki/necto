import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
// import db from '../db/models';

export const getAllTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamMembers = await prisma.employee.findMany({
      where: { tenantId },
      include: {
        contract: {
          where: {
            validUntil: null,
          },
        },
        teams: {
          select: {
            team: true,
          },
        },
        user: true,
      },
    });
    res.json(teamMembers);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
