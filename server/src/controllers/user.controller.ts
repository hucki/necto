import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
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
    const user = await prisma.user.findFirst({
      where: {
        a0Id: req.params.a0Id,
      },
      include: {
        userSettings: {
          where: {
            validUntil: {
              equals: null
            }
          },
          include: {
            employee: {
              include: {
                contract: true,
              }
            }
          },
        },

      },
    });
    res.json(user);
    res.status(200);
    return;
  } catch (e) {
    console.log(e);
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
    // const currentUser = await prisma.user.findFirst({
    //   where: { a0Id: req.params.a0Id },
    // });
    // if (currentUser) {
    //   res.status(403);
    //   res.render('error', { error: 'User already exists' });
    //   return;
    // }

    if (req.body.contactData?.create) {
      for (let i = 0; i < req.body.contactData.create.length; i++) {
        req.body.contactData.create[i].tenantId = tenantId;
      }
    }
    const createdUser = await prisma.user.create({
      data: {
        tenantId: tenantId,
        ...req.body,
      },
    });
    res.json(createdUser);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
