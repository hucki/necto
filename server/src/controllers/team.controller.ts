import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { addValidFromToContracts } from './employee.controller';
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
          where: {
            employee: {
              validUntil: null,
            },
          },
          include: {
            employee: {
              select: {
                uuid: true,
                firstName: true,
                lastName: true,
                validUntil: true,
                alias: true,
                contract: true,
              },
            },
          },
        },
      },
    });
    // for all employees in the team, use `addValidFromToContracts` to add `validFrom` to `contract` array
    teams.forEach((team) => {
      team.employees.forEach((employee) => {
        employee.employee.contract = addValidFromToContracts(
          employee.employee.contract
        );
      });
    });

    res.json(teams);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
