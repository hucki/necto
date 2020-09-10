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
