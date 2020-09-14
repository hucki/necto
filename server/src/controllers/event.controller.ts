import dayjs from 'dayjs';
import { Op } from 'sequelize';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import { Event, EventCreationAttributes } from '../db/models/Event';
dayjs.extend(isoWeek);

export const addEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdEvent = await Event.create({
      ...req.body,
    });
    res.json(createdEvent);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Events that are taking place in the given year/week combination
 *  @param {string} year
 *  @param {string} week
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
    const events = await Event.findAll({
      where: {
        startTime: {
          [Op.and]: [
            { [Op.gte]: firstOfWeek.toISOString() },
            { [Op.lte]: lastOfWeek.toISOString() },
          ],
        },
      },
    });
    res.json(events);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await Event.findAll();
    res.json(events);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
