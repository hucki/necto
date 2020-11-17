import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../db/models/Tenants';

/**
 * add App Settings
 *  @param {Tenant} req.body
 */
export const addTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdTenant = await Tenant.create({
      ...req.body,
    });
    res.json(createdTenant);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};