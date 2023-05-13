import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { AddpayFreedom, User } from '@prisma/client';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
dayjs.extend(isoWeek);

/**
 * add AddpayFreedom
 *  @param {AddpayFreedom} req.body
 */
export const addAddpayFreedom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const year = req.body.year;
    const incomingAddpayFreedom = {
      pid: req.body.pid,
      freedFrom: dayjs().date(1).month(0).year(year).toDate(),
      freedUntil: dayjs().date(31).month(11).year(year).toDate(),
    };
    const user = req.user as User;
    const createdAddpayFreedom = await prisma.addpayFreedom.create({
      data: {
        ...incomingAddpayFreedom,
        updatedBy: user.uuid,
        createdBy: user.uuid,
      },
    });

    res.json(createdAddpayFreedom);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * delete one AddpayFreedom
 *  @param {string} req.params.addpayId
 */
export const deleteAddpayFreedom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uuid = req.params.addpayId;
    const deletedAddpayFreedom = await prisma.addpayFreedom.delete({
      where: { uuid },
    });
    res.json(deletedAddpayFreedom);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all AddpayFreedom entries for one patient
 *  @param {string} req.params.patientId
 */
export const getPatientsAddpayFreedom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = req.params.patientId;
    const patientsAddpayFreedom = await prisma.addpayFreedom.findMany({
      where: {
        pid: patientId,
      },
    });
    res.json(patientsAddpayFreedom);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
