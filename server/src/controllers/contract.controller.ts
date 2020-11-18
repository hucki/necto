import { Request, Response, NextFunction } from 'express';
import { Contract } from '../db/models/Contract';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllContracts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contracts = await Contract.findAll();
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
    const createdContract = await Contract.create({
      tenantId: tenantId,
      ...req.body,
    });
    res.json(createdContract);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
