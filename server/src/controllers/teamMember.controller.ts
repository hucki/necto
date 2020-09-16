import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import db from '../db/models';

export const getAllTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [results, metadata] = await db.sequelize.query(
      `SELECT
          users.id AS id,
          users."fullName" AS "fullName",
          users."firstName" AS "firstName",
          users."lastName" AS "lastName",
          users."lastName" AS "lastName",
          users."validUntil" AS "validUntil",
          users."createdAt" AS "createdAt",
          users."updatedAt" AS "updatedAt",
          contracts."hoursPerWeek" AS "hoursPerWeek",
          contracts."appointmentsPerWeek" AS "appointmentsPerWeek",
          "userSettings"."bgColor" AS "bgColor"
       FROM users
       INNER JOIN contracts ON users.id=contracts."userId"
       INNER JOIN "userSettings" ON users.id="userSettings"."userId"`
    );
    res.json(results);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
