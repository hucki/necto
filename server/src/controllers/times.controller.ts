import { NextFunction, Request, Response } from 'express';
import prisma from '../db/prisma';
import { TimesheetEntry } from '@prisma/client';
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
 * add one TimesheetEntry
 *  @param {TimesheetEntry} req.body
 */
export const addTimesheetEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdTimesheetEntry = await prisma.timesheetEntry.create({
      data: {
        employeeId: req.body.employeeId,
        value: req.body.value,
        startTime: dayjs(req.body.startTime).toISOString(),
        endTime: dayjs(req.body.endTime).toISOString(),
        isDeleted: false,
        accountId: req.body.accountId,
        info: req.body.info,
      },
    });
    console.log(createdTimesheetEntry);
    res.json(createdTimesheetEntry);
    res.status(201);
    return;
  } catch (error) {
    next(error);
  }
};

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
