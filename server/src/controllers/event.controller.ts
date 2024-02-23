import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Serializer } from 'ts-japi';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { decryptPatient, encryptedPatientFields } from '../utils/crypto';
import { Contract, Employee, Event, User } from '@prisma/client';
import { notifyUser, sendEventChange } from '../utils/nodemailer';
import { addValidFromToContracts } from './employee.controller';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
dayjs.extend(isoWeek);

export type EventChange = {
  field: string;
  oldValue: string;
  newValue: string;
};

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
        leaveType: req.body.leaveType,
        leaveStatus: req.body.leaveStatus,
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
  const updatedBy = req.user;
  try {
    const eventId = req.params.eventId;
    const currentEvent = await prisma.event.findUnique({
      where: {
        uuid: eventId,
      },
    });
    const updatedEvent = await prisma.event.update({
      where: {
        uuid: eventId,
      },
      data: {
        userId: req.body.userId,
        ressourceId: req.body.ressourceId,
        title: req.body.title,
        type: req.body.type,
        leaveType: req.body.leaveType,
        leaveStatus: req.body.leaveStatus,
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
      include: {
        employee: {
          include: {
            contactData: true,
            user: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    const changedKeys = Object.keys(currentEvent).filter(
      (key) =>
        key !== 'updatedAt' &&
        key !== 'createdAt' &&
        currentEvent[key] !== updatedEvent[key]
    );
    const changes: EventChange[] = changedKeys.map((key) => ({
      field: key,
      oldValue: currentEvent[key],
      newValue: updatedEvent[key],
    }));
    const eventUserId = updatedEvent.employee.user?.userId;
    const employeeEmail = updatedEvent.employee.user.user.email;
    const updatedByUserId = (req.user as User).uuid;
    if (eventUserId && eventUserId !== updatedByUserId) {
      console.log('📧 notify Event User', employeeEmail, changes);
      sendEventChange({
        user: req.user as User,
        employee: updatedEvent.employee,
        employeeEmail,
        newEvent: updatedEvent,
        changes,
      });
    } else {
      console.log('❌📧 do NOT notify Event User');
    }
    res.json(updatedEvent);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Event and all future events of the same series
 *  @param {Event} req.body
 */
export const updateCurrentAndFutureEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = req.params.eventId;

    const updatableFieldsEvent = [
      'userId',
      'ressourceId',
      'title',
      'type: req.body.type',
      'leaveType',
      'leaveStatus',
      'isDiagnostic',
      'isHomeVisit',
      'isAllDay',
      'isRecurring',
      'isCancelled',
      'isDeleted',
      'isCancelledReason',
      'cancellationReasonId',
      'rrule',
      'startTime',
      'endTime',
      'bgColor',
      'tenantId',
      'roomId',
      'patientId',
      'parentEventId',
    ];

    const currentEventData = await prisma.event.findUnique({
      where: {
        uuid: eventId,
      },
    });
    const finalUpdateData = updatableFieldsEvent
      .map((field) =>
        // FIXME: allow removing isDiagnostic
        !req.body[field]
          ? null
          : req.body[field] === currentEventData[field]
          ? null
          : { [field]: req.body[field] }
      )
      .filter((item) => !!item)
      .reduce((prev, cur, _i, _arr) => {
        return Object.assign(prev, cur);
      });

    const updatedEvent = await prisma.event.update({
      where: {
        uuid: eventId,
      },
      data: finalUpdateData,
    });
    const parentEventId = updatedEvent.parentEventId || eventId;

    const futureEvents = await prisma.event.findMany({
      where: {
        AND: [
          { parentEventId },
          { startTime: { gte: updatedEvent.endTime.toISOString() } },
        ],
      },
    });

    const startTimeDiff = finalUpdateData.startTime
      ? dayjs(finalUpdateData.startTime).diff(currentEventData.startTime)
      : undefined;
    const endTimeDiff = finalUpdateData.endTime
      ? dayjs(finalUpdateData.endTime).diff(currentEventData.endTime)
      : undefined;

    const foundFutureEvents = futureEvents.length;
    if (foundFutureEvents) {
      for (let i = 0; i < foundFutureEvents; i++) {
        const newStartTime = startTimeDiff
          ? dayjs(futureEvents[i].startTime).add(startTimeDiff).toISOString()
          : undefined;
        const newEndTime = endTimeDiff
          ? dayjs(futureEvents[i].endTime).add(endTimeDiff).toISOString()
          : undefined;
        await prisma.event.update({
          where: {
            uuid: futureEvents[i].uuid,
          },
          data: {
            ...finalUpdateData,
            parentEventId,
            startTime: newStartTime,
            endTime: newEndTime,
          },
        });
      }
    }

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
 * delete one Event and its childEvents by eventId
 *  @param {string} req.params.eventId
 */
export const deleteEventWithChildren = async (
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
    await prisma.event.updateMany({
      where: { parentEventId: eventId },
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
 * delete one Event and all future events of the same series
 *  @param {string} req.params.eventId
 */
export const deleteCurrentAndFutureEvents = async (
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
    const parentEventId = deletedEvent.parentEventId || eventId;
    await prisma.event.updateMany({
      where: {
        AND: [
          { parentEventId },
          { startTime: { gte: deletedEvent.endTime.toISOString() } },
        ],
      },
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
 * get all Events per month of the defined employeeId
 *  @param {string} req.params.employeeId
 *  @param {string} req.params.year
 *  @param {string} req.params.month
 */
export const getEmployeeEventsPerMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employeeId = req.params.employeeId;
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const firstOfMonth = dayjs().year(year).month(month).startOf('month');
    const lastOfMonth = firstOfMonth.endOf('month');
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            AND: [
              { startTime: { gte: firstOfMonth.toISOString() } },
              { startTime: { lte: lastOfMonth.toISOString() } },
              { isDeleted: false },
              employeeId && {
                ressourceId: employeeId,
              },
            ],
          },
          {
            AND: [
              { endTime: { gte: firstOfMonth.toISOString() } },
              { endTime: { lte: lastOfMonth.toISOString() } },
              { isDeleted: false },
              employeeId && {
                ressourceId: employeeId,
              },
            ],
          },
        ],
      },
      include: {
        patient: true,
        parentEvent: { include: { childEvents: true } },
        childEvents: true,
        room: { include: { building: true } },
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
 * get Leaves by status
 *  @param {Event['leaveStatus']} req.params.leaveStatus
 */
export const getLeavesByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isDeleted: false,
        type: 'leave',
        leaveStatus: req.params.leaveStatus,
      },
      include: {
        employee: true,
        parentEvent: { include: { childEvents: true } },
        childEvents: true,
        room: { include: { building: true } },
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
 * approve Leave
 *  @param {Event['id']} req.params.leaveId
 */
export const approveLeave = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leaveId = req.params.leaveId;
    const approvedLeave = await prisma.event.update({
      where: {
        uuid: leaveId,
      },
      data: {
        leaveStatus: 'approved',
      },
      include: {
        childEvents: true,
      },
    });
    if (
      approvedLeave.leaveStatus === 'approved' &&
      approvedLeave.childEvents.length
    ) {
      for (let i = 0; i < approvedLeave.childEvents.length; i++) {
        await prisma.event.update({
          where: {
            uuid: approvedLeave.childEvents[i].uuid,
          },
          data: {
            leaveStatus: 'approved',
          },
        });
      }
    }
    const result = await prisma.event.findUnique({
      where: { uuid: leaveId },
      include: { childEvents: true },
    });
    res.json(result);
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

/**
 * API V2 filter parameter
 */
const filterParameter = [
  'employeeId',
  'year',
  'week',
  'month',
  'date',
  'roomId',
  'isDiagnostic',
  'patientId',
] as const;
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
 * API V2 get Events per queryParameter
 * https://jsonapi.org/recommendations/
 */
export const getEvents = async (
  req: APIRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      year,
      month,
      week,
      date,
      employeeId,
      roomId,
      isDiagnostic,
      patientId,
    } = req.query.filter;
    const includes = req.query.includes ? req.query.includes.split(',') : [];
    let startDate;
    let endDate;
    if (year && month) {
      const thisYear = parseInt(year);
      const thisMonth = parseInt(month);
      startDate = dayjs().year(thisYear).month(thisMonth).startOf('month');
      endDate = startDate.endOf('month');
    } else if (year && week) {
      const thisYear = parseInt(year);
      const thisWeek = parseInt(week);
      startDate = dayjs(date).set('hour', 0).set('minute', 0).set('second', 0);
      endDate = startDate.endOf('isoWeek');
    } else if (date) {
      startDate = dayjs(date).set('hour', 0).set('minute', 0).set('second', 0);
      endDate = startDate.add(24, 'h');
    }
    const startDateISOString = startDate?.toISOString();
    const endDateISOString = endDate?.toISOString();
    type WhereClause =
      | { isDeleted: boolean }
      | { isDiagnostic: boolean }
      | { patientId: string }
      | { ressourceId: string }
      | { roomId: { not: null } }
      | { roomId: string };
    type WhereClauseWithoutDates = WhereClause[];
    const whereClauseWithoutDates: WhereClauseWithoutDates = [
      { isDeleted: false },
    ];
    if (employeeId) whereClauseWithoutDates.push({ ressourceId: employeeId });
    if (patientId)
      whereClauseWithoutDates.push({
        patientId: patientId,
      });
    if (roomId) {
      if (roomId === 'IS NOT NULL') {
        whereClauseWithoutDates.push({ roomId: { not: null } });
      } else {
        whereClauseWithoutDates.push({ roomId: roomId });
      }
    }
    if (isDiagnostic)
      whereClauseWithoutDates.push({
        isDiagnostic: Boolean(isDiagnostic),
      });
    const whereClauseWithDates = {
      OR: [
        {
          AND: [
            { startTime: { gte: startDateISOString } },
            { startTime: { lte: endDateISOString } },
            ...whereClauseWithoutDates,
          ],
        },
        {
          AND: [
            { endTime: { gte: startDateISOString } },
            { endTime: { lte: endDateISOString } },
            ...whereClauseWithoutDates,
          ],
        },
      ],
    };
    const events = await prisma.event.findMany({
      where:
        startDate && endDate
          ? whereClauseWithDates
          : { AND: whereClauseWithoutDates },
      include: {
        patient: Boolean(includes.includes('patient')),
        parentEvent: includes.includes('parentEvent')
          ? { include: { childEvents: true } }
          : false,
        childEvents: Boolean(includes.includes('childEvents')),
        room: includes.includes('room')
          ? { include: { building: true } }
          : false,
        employee: { include: { contract: true } },
      },
    });
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event.patient) {
        event.patient = decryptPatient({
          patient: event.patient,
          fields: encryptedPatientFields,
        });
      }
      if (!includes.includes('employee')) {
        delete event.employee;
      } else {
        event.employee.contract = addValidFromToContracts(
          event.employee.contract
        );
      }
    }
    const EventSerializer = new Serializer('events');
    let response;
    try {
      response = await EventSerializer.serialize(events);
    } catch (error) {
      console.error(error);
    }
    res.set({ 'Content-Type': 'application/vnd.api+json' });
    res.json(response);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
