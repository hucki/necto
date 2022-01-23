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
    const employees = await prisma.employee.findMany({ where: { tenantId } });
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
      },
    });
    res.json(createdEmployee);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};