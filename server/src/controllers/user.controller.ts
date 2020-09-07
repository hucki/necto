import { Request, Response, NextFunction } from 'express';

const UserModel = require('../db/models/user')(sequelize, DataTypes);

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
