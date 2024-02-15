import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { addValidFromToContracts } from './employee.controller';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    res.json(users);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get one User with uuid
 *  @param {string} req.params.uuid
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: req.params.uuid,
      },
      include: {
        userSettings: {
          where: {
            validUntil: {
              equals: null,
            },
          },
          include: {
            employee: {
              include: {
                contract: true,
              },
            },
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    if (user?.userSettings) {
      for (let i = 0; i < user.userSettings.length; i++) {
        user.userSettings[i].employee.contract = addValidFromToContracts(
          user.userSettings[i].employee.contract
        );
      }
    }
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
        email: req.body.email,
        password: '', // bcrypt.hash(req.body.email),
        a0Id: req.body.a0Id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });
    let createdSettings;
    if (req.body.employeeId) {
      createdSettings = await prisma.userSettings.create({
        data: {
          tenantId: tenantId,
          userId: createdUser.uuid,
          employeeId: req.body.employeeId,
        },
      });
    }
    res.json({ createdUser, createdSettings });
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
/**
 * update one User
 *  @param {User} req.body
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        uuid: req.body.uuid,
      },
      data: {
        a0Id: req.body.a0Id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tenantId: tenantId,
      },
    });
    let updatedSettings;
    if (req.body.userSettings?.length) {
      updatedSettings = await prisma.userSettings.upsert({
        where: {
          id: req.body.userSettings[0].id,
        },
        update: {
          employeeId: req.body.userSettings[0].employeeId,
        },
        create: {
          userId: req.body.uuid,
          employeeId: req.body.userSettings[0].employeeId,
          tenantId: tenantId,
        },
      });
    }
    if (req.body.permissions?.length) {
      for (let i = 0; i < req.body.permissions.length; i++) {
        const u2p = await prisma.userToPermissions.upsert({
          where: {
            userId_permissionId: {
              userId: req.body.uuid,
              permissionId: req.body.permissions[i].permissionId,
            },
          },
          update: {},
          create: {
            userId: req.body.uuid,
            permissionId: req.body.permissions[i].permissionId,
            tenantId: tenantId,
          },
        });
      }
    }
    res.json({ updatedUser, updatedSettings });
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
