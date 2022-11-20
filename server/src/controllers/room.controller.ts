import { Room } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

/**
 * add Room
 *  @param {Room} req.body
 */
export const addRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdRoom = await prisma.room.create({
      data: {
        ...req.body,
      },
    });
    res.json(createdRoom);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Rooms
 */
export const getAllRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allRooms = await prisma.room.findMany({
      include: {
        building: true,
      },
    });
    res.json(allRooms);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
