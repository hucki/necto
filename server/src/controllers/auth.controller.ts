import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { User } from '@prisma/client';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

// TODO:
// renew token regularly upon interaction

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if(req.isAuthenticated()) {
    return next()
  }
  req.logout()
  res.status(401).json({status: 401, msg: 'unauthorized'})
};

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await check('email', 'email is not valid').isEmail().run(req);
  await check('password', 'password must not be blank').isLength({min: 1}).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors)
    return;
  }
  return next();
}

export const authenticateCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user
  req.login(user, function(err) {
    if (err) { return next(err); }
    return;
  });
}

export const issueToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: 12 * 60 * 60 * 1000 });
  res.status(200).json({token});
  return;
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {email, password} = req?.body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.json('improper values');
    res.status(400);
  }
  try {
    const user = await prisma.user.findUnique({where: { email }})
    if (user) {
      res.status(403).json({message: 'email already registered'});
    } else {
      const hashedPassword = await bcrypt.hash(password,10);
      const createdUser = await prisma.user.create({
        data: {
          tenantId,
          email,
          password: hashedPassword
        }
      })
      res.json({
        uuid: createdUser.uuid,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      });
      res.status(201);
    }
  } catch (error) {
    console.log({error})
  }
}

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user as User
  res.json({
    uuid: user.uuid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
  return;
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  req.logout();
  res.status(200).json('logged out');
  return;
};

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdSettings = await prisma.appSettings.create({
      data: {
        ...req.body,
      },
    });
    res.json(createdSettings);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
