import { NextFunction, Request, Response } from 'express';
import prisma from '../db/prisma';
import { Account } from '@prisma/client';
import dayjs from 'dayjs';
const tenantId = process.env.TENANT_UUID;

/**
 * API V2 filter parameter
 */
const filterParameter = ['employeeId'] as const;
type FilterParameter = (typeof filterParameter)[number];
interface APIRequest extends Request {
  query: {
    filter: {
      [key in FilterParameter]: string;
    };
    includes: string;
  };
}
/**
 * add one Account
 *  @param {Account} req.body
 */
export const addAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdAccount = await prisma.account.create({
      data: {
        unit: req.body.unit,
        timeTypeId: req.body.timeTypeId,
        description: req.body.description,
        validFrom: dayjs(req.body.description).toISOString(),
        validUntil: dayjs(req.body.description).toISOString(),
      },
    });
    res.json(createdAccount);
    res.status(201);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAccounts = async (
  req: APIRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accounts = prisma.account.findMany();
    res.json(accounts);
    res.status(200);
    return;
  } catch (error) {
    next(error);
  }
};
