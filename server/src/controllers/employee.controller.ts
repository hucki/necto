import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { Contract, Employee } from '@prisma/client';
import dayjs from 'dayjs';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      where: { tenantId },
      include: {
        contract: true,
        teams: {
          select: {
            team: true,
          },
        },
        user: true,
      },
    });
    res.json(employees);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
export const getOneEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const employeeId = req.params.employeeId;
  try {
    const employee = await prisma.employee.findUnique({
      where: { uuid: employeeId },
      include: {
        contract: true,
        teams: {
          select: {
            team: true,
          },
        },
        user: true,
      },
    });
    res.json(employee);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

export const getAllActiveEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        tenantId,
        validUntil: null,
      },
      include: {
        contract: {
          where: {
            validUntil: null,
          },
        },
        teams: {
          select: {
            team: true,
          },
        },
        user: true,
      },
    });
    res.json(employees);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
export const getAllActiveEmployeesWithEventsPerWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const year = parseInt(req.params.year);
  const week = parseInt(req.params.week);
  const firstOfWeek = dayjs().isoWeek(week).year(year).startOf('isoWeek');
  const lastOfWeek = firstOfWeek.endOf('isoWeek');
  try {
    const employees = await prisma.employee.findMany({
      where: {
        tenantId,
        validUntil: null,
      },
      include: {
        contract: {
          where: {
            validUntil: null,
          },
        },
        teams: {
          select: {
            team: true,
          },
        },
        events: {
          where: {
            OR: [
              {
                AND: [
                  { startTime: { gte: firstOfWeek.toISOString() } },
                  { startTime: { lte: lastOfWeek.toISOString() } },
                  { isDeleted: false },
                ],
              },
              {
                AND: [
                  { endTime: { gte: firstOfWeek.toISOString() } },
                  { endTime: { lte: lastOfWeek.toISOString() } },
                  { isDeleted: false },
                ],
              },
            ],
          },
        },
        user: true,
      },
    });
    res.json(employees);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
export const getAllActiveEmployeesWithEventsPerMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  const firstOfMonth = dayjs().year(year).month(month).startOf('month');
  const lastOfMonth = firstOfMonth.endOf('month');
  try {
    const employees = await prisma.employee.findMany({
      where: {
        tenantId,
        validUntil: null,
      },
      include: {
        contract: {
          where: {
            validUntil: null,
          },
        },
        teams: {
          select: {
            team: true,
          },
        },
        events: {
          where: {
            OR: [
              {
                AND: [
                  { startTime: { gte: firstOfMonth.toISOString() } },
                  { startTime: { lte: lastOfMonth.toISOString() } },
                  { isDeleted: false },
                ],
              },
              {
                AND: [
                  { endTime: { gte: firstOfMonth.toISOString() } },
                  { endTime: { lte: lastOfMonth.toISOString() } },
                  { isDeleted: false },
                ],
              },
            ],
          },
        },
        user: true,
      },
    });
    res.json(employees);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add one Employee
 *  @param {Employee} req.body
 */
export const addEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdEmployee = await prisma.employee.create({
      data: {
        tenantId: tenantId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyId: req.body.companyId,
        contract: {
          create: {
            tenantId: tenantId,
          },
        },
      },
      include: {
        contract: {
          where: {
            validUntil: null,
          },
        },
      },
    });

    if (!createdEmployee.contract.length) {
      await prisma.contract.create({
        data: {
          employeeId: createdEmployee.uuid,
          tenantId: tenantId,
        },
      });
    }

    res.json(createdEmployee);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Employee
 *  @param {Employee} req.body
 */
export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedEmployee = await prisma.employee.update({
      where: {
        uuid: req.body.uuid,
      },
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        alias: req.body.alias,
        validUntil: req.body.validUntil,
        tenantId: tenantId,
      },
    });
    let updatedSettings;
    if (req.body.userId) {
      if (req.body.userId === 'remove') {
        await prisma.userSettings.update({
          where: {
            employeeId: req.body.uuid,
          },
          data: {
            employeeId: null,
          },
        });
      } else if (!req.body.user) {
        updatedSettings = await prisma.userSettings.create({
          data: {
            userId: req.body.userId,
            employeeId: req.body.uuid,
            tenantId: tenantId,
          },
        });
      } else if (req.body.userId !== req.body.user.userId) {
        updatedSettings = await prisma.userSettings.update({
          where: {
            id: req.body.user ? req.body.user.id : undefined,
          },
          data: {
            userId: req.body.userId,
          },
        });
      }
    }

    res.json({ updatedEmployee });
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * API V2 filter parameter
 */
const filterParameter = ['year', 'month'] as const;
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
 * API V2 get employee with events summary per month or year
 */

export const getActiveEmployeeWithEvents = async (
  req: APIRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const employeeId = req.params.employeeId;
  const { year, month } = req.query.filter;
  const thisYear = parseInt(year);
  const thisMonth = month ? parseInt(month) : undefined;

  const startDate = dayjs(`${thisYear}-${thisMonth || '01'}-01`).startOf(
    thisMonth ? 'month' : 'year'
  );
  const endDate = startDate.endOf(thisMonth ? 'month' : 'year');

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        uuid: employeeId,
      },
      include: {
        contract: {
          where: {
            OR: [
              {
                validUntil: null,
              },
              {
                validUntil: {
                  gte: startDate.hour(0).minute(0).second(0).toISOString(),
                },
              },
              {
                validUntil: {
                  gte: endDate.hour(0).minute(0).second(0).toISOString(),
                },
              },
            ],
          },
        },
        events: {
          where: {
            OR: [
              {
                AND: [
                  { startTime: { gte: startDate.toISOString() } },
                  { startTime: { lte: endDate.toISOString() } },
                  { isDeleted: false },
                  { isCancelled: false },
                ],
              },
              {
                AND: [
                  { endTime: { gte: startDate.toISOString() } },
                  { endTime: { lte: endDate.toISOString() } },
                  { isDeleted: false },
                  { isCancelled: false },
                ],
              },
            ],
          },
        },
        user: true,
      },
    });
    employee.contract = addValidFromToContracts(employee.contract);
    res.json(employee);
    res.status(201);
  } catch (error) {
    console.error(error);
  }
};

const addValidFromToContracts = (contracts: Contract[]): Contract[] => {
  const sortedContracts = contracts
    .map((c) => ({
      ...c,
      validUntil:
        c.validUntil === null ? dayjs('12.31.2999').toDate() : c.validUntil,
    }))
    .sort((a, b) =>
      dayjs(a.validUntil).isBefore(dayjs(b.validUntil)) ? -1 : 1
    );
  return sortedContracts.map((contract, index) => {
    if (index === 0) {
      return {
        ...contract,
        validFrom: dayjs('01.01.1970').toDate(),
      };
    }
    return {
      ...contract,
      validFrom: dayjs(sortedContracts[index - 1].validUntil)
        .add(1, 'day')
        .toDate(),
    };
  });
};
