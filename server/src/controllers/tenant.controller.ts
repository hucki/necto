import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

/**
 * get App tenants
 */
export const getAllTenants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenants = await prisma.tenant.findMany();
    res.json(tenants);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add App Tenant
 *  @param {Tenant} req.body
 */
export const addTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdTenant = await prisma.tenant.create({
      data: {
        ...req.body,
      },
    });
    res.json(createdTenant);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
