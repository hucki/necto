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
 * get one User with the given Auth0 ID
 *  @param {string} req.params.a0Id
 */
export const getOneUserByAuth0Id = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({where: {a0Id: req.params.a0Id}})
    res.json(req.params.a0Id);
    res.status(200);
    return;
  } catch (e) {
    console.log(e)
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
