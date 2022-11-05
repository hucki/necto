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
            team: true,
          },
        },
        user: true,
      },
    });
    res.json(employees);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
export const getAllActiveEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        tenantId,
        validUntil: null,
      },
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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyId: req.body.companyId,
        contract: {
          create: {
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

    if (!createdEmployee.contract.length) {
      await prisma.contract.create({
        data: {
          employeeId: createdEmployee.uuid,
          tenantId: tenantId,
        },
      });
    }

    res.json(createdEmployee);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Employee
 *  @param {Employee} req.body
 */
export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedEmployee = await prisma.employee.update({
      where: {
        uuid: req.body.uuid,
      },
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        alias: req.body.alias,
        validUntil: req.body.validUntil,
        tenantId: tenantId,
      },
    });
    // let updatedSettings;
    // if (req.body.userId && req.body.userId !== req.body.user?.userId) {
    //   updatedSettings = await prisma.userSettings.upsert({
    //     where: {
    //       id: req.body.user.id,
    //     },
    //     update: {
    //       userId: req.body.userId,
    //     },
    //     create: {
    //       userId: req.body.userId,
    //       employeeId: req.body.uuid,
    //       tenantId: tenantId,
    //     },
    //   });
    // }
    res.json({ updatedEmployee });
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
