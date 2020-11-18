import { Request, Response, NextFunction } from 'express';
import { User } from '../db/models/User';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

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
 * add one User
 *  @param {User} req.body
 */
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdUser = await User.create({
      tenantId: tenantId,
      ...req.body,
    });
    res.json(createdUser);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
