import { NextFunction, Request, Response } from 'express';
import prisma from '../db/prisma';
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

export const getTimes = async (
  req: APIRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.query.filter;
    const times = prisma.timesheetEntry.findMany({
      where: {
        employeeId,
      },
    });
    res.json(times);
    res.status(200);
    return;
  } catch (error) {
    next(error);
  }
};
