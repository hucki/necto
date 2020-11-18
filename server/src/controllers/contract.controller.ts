import { Request, Response, NextFunction } from 'express';

import { Contract } from '../db/models/Contract';

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
      tenantId: "f4c2a988-2f7a-45f9-b8ac-bdb7eb230a07",
      ...req.body,
    });
    res.json(createdContract);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
