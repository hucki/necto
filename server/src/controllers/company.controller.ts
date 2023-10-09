import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { Company } from '@prisma/client';

dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getCurrentCompany = async (): Promise<Company> => {
  try {
    const company = await prisma.company.findMany({ where: { tenantId } });
    return company[0];
  } catch (error) {
    console.error(error);
  }
};

/**
 * get companies
 */
export const getAllCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companies = await prisma.company.findMany({ where: { tenantId } });
    res.json(companies);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
