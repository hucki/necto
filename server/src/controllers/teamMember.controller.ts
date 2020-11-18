import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
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
          users."firstName" AS "firstName",
          users."lastName" AS "lastName",
          users."validUntil" AS "validUntil",
          users."createdAt" AS "createdAt",
          users."updatedAt" AS "updatedAt",
          contracts."hoursPerWeek" AS "hoursPerWeek",
          contracts."appointmentsPerWeek" AS "appointmentsPerWeek",
          "userSettings"."bgColor" AS "bgColor"
      FROM users
      LEFT JOIN contracts
        ON users.id=contracts."userId"
        AND users."tenantId"=contracts."tenantId"
      LEFT JOIN "userSettings"
        ON users.id="userSettings"."userId"
        AND users."tenantId"="userSettings"."tenantId"
      WHERE users."tenantId" = '${tenantId}'`
    );
    res.json(results);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
