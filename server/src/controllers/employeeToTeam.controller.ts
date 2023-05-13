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
        teamId: req.body.teamId,
        employeeId: req.body.employeeId,
      },
    });

    res.json(addedEmployeeToTeam);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

export const removeEmployeeFromTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await prisma.employeeToTeam.delete({
      where: {
        employeeId_teamId: {
          employeeId: req.body.employeeId,
          teamId: req.body.teamId,
        },
      },
    });

    res.json('ok');
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

export const getTeamsOfEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const employeeId = req.params.employeeId;
  try {
    const { teams } = await prisma.employee.findUnique({
      where: {
        uuid: employeeId,
      },
      include: {
        teams: true,
      },
    });

    res.json(teams);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
