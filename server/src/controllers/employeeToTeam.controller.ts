import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const addEmployeeToTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const addedEmployeeToTeam = await prisma.employeeToTeam.create({
      data: {
        tenantId,
        teamId: req.body.team.uuid,
        employeeId: req.body.employee.uuid,
      },
    });

    res.json(addedEmployeeToTeam);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
