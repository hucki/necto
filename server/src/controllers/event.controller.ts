import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { decryptPatient } from '../utils/crypto';
import { encryptedPatientFields } from './patient.controller';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
dayjs.extend(isoWeek);

/**
 * add one Event
 *  @param {Event} req.body
 */
export const addEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdEvent = await prisma.event.create({
      data: {
        userId: req.body.userId,
        ressourceId: req.body.ressourceId,
        title: req.body.title,
        type: req.body.type,
        isDiagnostic: req.body.isDiagnostic,
        isHomeVisit: req.body.isHomeVisit,
        isAllDay: req.body.isAllDay,
        isRecurring: req.body.isRecurring,
        isCancelled: req.body.isCancelled,
        isDeleted: req.body.isDeleted,
        isDone: req.body.isDone,
        isCancelledReason: req.body.isCancelledReason, // deprecated
        cancellationReasonId: req.body.cancellationReasonId,
        rrule: req.body.rrule,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        bgColor: req.body.bgColor,
        tenantId: tenantId,
        roomId: req.body.roomId ? req.body.roomId : null,
        patientId: req.body.patientId ? req.body.patientId : null,
        parentEventId: req.body.parentEventId ? req.body.parentEventId : null,
      },
    });
    res.json(createdEvent);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Event
 *  @param {Event} req.body
 */
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = req.params.eventId;
    const updatedEvent = await prisma.event.update({
      where: {
        uuid: eventId,
      },
      data: {
        userId: req.body.userId,
        ressourceId: req.body.ressourceId,
        title: req.body.title,
        type: req.body.type,
        isDiagnostic: req.body.isDiagnostic,
        isHomeVisit: req.body.isHomeVisit,
        isAllDay: req.body.isAllDay,
        isRecurring: req.body.isRecurring,
        isCancelled: req.body.isCancelled,
        isDeleted: req.body.isDeleted,
        isDone: req.body.isDone,
        isCancelledReason: req.body.isCancelledReason, // deprecated
        cancellationReasonId: req.body.cancellationReasonId,
        rrule: req.body.rrule,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        bgColor: req.body.bgColor,
        tenantId: tenantId,
        roomId: req.body.roomId ? req.body.roomId : null,
        patientId: req.body.patientId ? req.body.patientId : null,
        parentEventId: req.body.parentEventId ? req.body.parentEventId : null,
      },
    });
    res.json(updatedEvent);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * delete one Event by eventId
 *  @param {string} req.params.eventId
 */
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = req.params.eventId;
    const deletedEvent = await prisma.event.update({
      where: { uuid: eventId },
      data: { isDeleted: true },
    });
    res.json(deletedEvent);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
/**
 * get all Events that are taking place in the given year/week combination
 *  @param {string} req.params.year
 *  @param {string} req.params.month
 *  @param {string} req.params.day
 */
export const getDaysEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startDate = dayjs(
      `${req.params.year}-${req.params.month}-${req.params.day}`
    )
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 1);
    const endDate = startDate.add(24, 'h');

    const events = await prisma.event.findMany({
      where: {
        AND: [
          {
            startTime: {
              gte: startDate.toISOString(),
            },
          },
          {
            startTime: {
              lt: endDate.toISOString(),
            },
          },
          {
            isDeleted: false,
          },
        ],
      },
      include: {
        patient: true,
      },
    });
    for (let i = 0; i < events.length; i++) {
      if (events[i].patient) {
        events[i].patient = decryptPatient({
          patient: events[i].patient,
          fields: encryptedPatientFields,
        });
      }
    }
    res.json(events);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Events that are taking place in the given year/week combination
 *  @param {string} req.params.year
 *  @param {string} req.params.week
 */
export const getWeeksEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const year = parseInt(req.params.year);
    const week = parseInt(req.params.week);
    const firstOfWeek = dayjs().year(year).isoWeek(week).startOf('isoWeek');
    const lastOfWeek = firstOfWeek.endOf('isoWeek');
    const events = await prisma.event.findMany({
      where: {
        AND: [
          { startTime: { gte: firstOfWeek.toISOString() } },
          { startTime: { lte: lastOfWeek.toISOString() } },
          { isDeleted: false },
        ],
      },
      include: {
        patient: true,
      },
    });
    for (let i = 0; i < events.length; i++) {
      if (events[i].patient) {
        events[i].patient = decryptPatient({
          patient: events[i].patient,
          fields: encryptedPatientFields,
        });
      }
    }
    res.json(events);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Events
 */
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isDeleted: false,
      },
    });
    res.json(events);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all deleted Events
 */
export const getAllDeletedEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isDeleted: true,
      },
    });
    res.json(events);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
