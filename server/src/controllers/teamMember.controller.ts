import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { addValidFromToContracts } from './employee.controller';
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
        contract: true,
        teams: {
          select: {
            team: true,
          },
        },
        user: true,
      },
    });
    for (const teamMember of teamMembers) {
      teamMember.contract = addValidFromToContracts(teamMember.contract);
    }
    res.json(teamMembers);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
