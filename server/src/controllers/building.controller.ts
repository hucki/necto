import { Building } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

/**
 * add Building
 *  @param {Building} req.body
 */
export const addBuilding = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdBuilding = await prisma.building.create({
      data: {
        ...req.body,
      },
    });
    res.json(createdBuilding);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Buildings
 */
export const getAllBuildings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allBuildings = await prisma.building.findMany();
    res.json(allBuildings);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
