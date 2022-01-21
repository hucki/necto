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
        ...req.body,
      },
    });
    res.json(createdContract);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
