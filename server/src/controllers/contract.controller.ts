import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllContracts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contracts = await prisma.contract.findMany();
    res.json(contracts);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add one Contract
 *  @param {Contract} req.body
 */
export const addContract = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdContract = await prisma.contract.create({
      data: {
        tenantId: tenantId,
        employeeId: req.body.employeeId,
        bgColor: req.body.bgColor,
        roomId: req.body.roomId,
        appointmentsPerWeek: parseInt(req.body.appointmentsPerWeek),
        hoursPerWeek: parseInt(req.body.hoursPerWeek),
      },
      include: {
        employee: true,
      },
    });
    res.json(createdContract);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Contract
 *  @param {Contract} req.body
 */
export const updateContract = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contractId = parseInt(req.params.contractId);
    const updatedContract = await prisma.contract.update({
      where: {
        id: contractId,
      },
      data: {
        bgColor: req.body.bgColor,
        roomId: req.body.roomId,
        appointmentsPerWeek: parseInt(req.body.appointmentsPerWeek),
        hoursPerWeek: parseInt(req.body.hoursPerWeek),
      },
      include: {
        employee: true,
      },
    });
    res.json(updatedContract);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
