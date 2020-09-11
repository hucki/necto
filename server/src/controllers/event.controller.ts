import { Request, Response, NextFunction } from 'express';

import { Event, EventCreationAttributes } from '../db/models/Event';

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
