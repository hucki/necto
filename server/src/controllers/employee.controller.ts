import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { Employee } from '@prisma/client';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      where: { tenantId },
      include: {
        contract: {
          where: {
            validUntil: null,
          },
        },
        teams: {
          select: {
            team: true
          }
        }
      },
    });
    res.json(employees);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add one Employee
 *  @param {Employee} req.body
 */
export const addEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdEmployee = await prisma.employee.create({
      data: {
        tenantId: tenantId,
        ...req.body,
        create: {
          contract: {
            tenantId: tenantId,
          },
        },
      },
      include: {
        contract: {
          where: {
            validUntil: null,
          },
        },
      },
    });

    // let createdContract = null;
    // if (!createdEmployee.contract.length) {
    //   createdContract = await prisma.contract.create({
    //     data: {
    //       employeeId: createdEmployee.uuid,
    //       tenantId: tenantId,
    //     },
    //   });
    // }

    res.json(createdEmployee);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
