import { Request, Response, NextFunction } from 'express';

import { Event } from '../db/models/Event';

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
