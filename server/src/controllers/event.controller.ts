import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
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
    console.log({ req: req.body });
    const createdEvent = await prisma.event.create({
      data: {
        userId: req.body.userId,
        ressourceId: req.body.ressourceId,
        title: req.body.title,
        type: req.body.type,
        isHomeVisit: req.body.isHomeVisit,
        isAllDay: req.body.isAllDay,
        isRecurring: req.body.isRecurring,
        isCancelled: req.body.isCancelled,
        isCancelledReason: req.body.isCancelledReason,
        rrule: req.body.rrule,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        bgColor: req.body.bgColor,
        tenantId: tenantId,
        roomId: req.body.roomId ? req.body.roomId : null,
        patientId: req.body.patientId ? req.body.patientId : null,
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
    console.log({ req: req.body, eId: req.params.eventId });
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
        isHomeVisit: req.body.isHomeVisit,
        isAllDay: req.body.isAllDay,
        isRecurring: req.body.isRecurring,
        isCancelled: req.body.isCancelled,
        isCancelledReason: req.body.isCancelledReason,
        rrule: req.body.rrule,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        bgColor: req.body.bgColor,
        tenantId: tenantId,
        roomId: req.body.roomId ? req.body.roomId : null,
        patientId: req.body.patientId ? req.body.patientId : null,
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
    const deletedEvent = await prisma.event.delete({
      where: { uuid: eventId },
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
        ],
      },
      include: {
        patient: true,
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
        ],
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
 * get all Events
 */
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
