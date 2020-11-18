import { Request, Response, NextFunction } from 'express';

import { User } from '../db/models/User';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.findAll();
    res.json(users);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add one Event
 *  @param {User} req.body
 */
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdUser = await User.create({
      tenantId: "f4c2a988-2f7a-45f9-b8ac-bdb7eb230a07",
      ...req.body,
    });
    res.json(createdUser);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
