import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import {
  PermissionLevel,
  User,
  UserToPermissions,
  UserSettings,
} from '@prisma/client';
import { transporter } from '../utils/nodemailer';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
const environment = process.env.NODE_ENV;

const generatePassword = () => {
  let password = '';
  const allowedChars =
    'ABCDEFGHIJKLFMNOPQRSTUVWXYZ' +
    'abcdefghijklfmnopqrstuvwxyz' +
    '0123456789$_=%';
  for (let i = 0; i <= 8; i++) {
    const char = Math.floor(Math.random() * allowedChars.length + 1);
    password += allowedChars.charAt(char);
  }
  return password;
};

type UserRoles = {
  isAdmin: boolean;
  isEmployee: boolean;
  isPlanner: boolean;
};

// TODO:
// renew token regularly upon interaction

export const isAuthenticated = (
  req: Request & { logout: (err: any) => void },
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }
    res.status(401).json({ message: 'unauthorized', status: 401 });
  });
};

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check('email', 'eMail has to be an eMail').isEmail().run(req);
  await check('password', 'password must not be blank')
    .isLength({ min: 1 })
    .run(req);
  const errors = validationResult(req).array();
  if (errors.length) {
    const errorMessage = errors.map((e) => e.msg).join();
    res.status(400).json({ message: errorMessage, status: 400 });
    return;
  }
  return next();
};

export const authenticateCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  req.login(user, function (err) {
    if (err) {
      return next(err);
    }
    return;
  });
};

export const issueToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = jwt.sign(req.user, process.env.JWT_SECRET, {
    expiresIn: 12 * 60 * 60 * 1000,
  });
  res.status(200).json({ token });
  return;
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName } = req?.body;
  console.log({ email, password, firstName, lastName });
  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    res.json('improper values');
    res.status(400);
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      res
        .status(403)
        .json({ message: 'email already registered', status: 403 });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await prisma.user.create({
        data: {
          tenantId,
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });
      res.json({
        uuid: createdUser.uuid,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      });
      res.status(201);
    }
  } catch (error) {
    console.log({ error });
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user as User & {
    permissions: (UserToPermissions & { permission: PermissionLevel })[];
  } & {
    userSettings: UserSettings[];
  };
  res.json({
    uuid: user.uuid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: Boolean(
      user?.permissions?.find((p) => p.permission?.displayName === 'admin')
    ),
    isPlanner: Boolean(
      user?.permissions?.find((p) => p.permission?.displayName === 'planner')
    ),
    isEmployee: Boolean(
      user?.permissions?.find((p) => p.permission?.displayName === 'employee')
    ),
    employeeId: (user?.userSettings && user?.userSettings[0].employeeId) || '',
  });
  return;
};

export const logout = async (
  req: Request & { logout: (err: any) => void },
  res: Response,
  next: NextFunction
): Promise<void> => {
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }
    res.status(200).json('logged out');
  });

  return;
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req?.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // no action required if no user found with the provided email
    res.status(200).json('ok');
    return;
  }
  // generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  try {
    const updatedUser = await prisma.user.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        passwordResetToken,
        passwordResetAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    // send password reset link with token
    const resetUrl = new URL(
      req.headers.origin + `/resetpassword/${passwordResetToken}`
    );
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: updatedUser.email,
      subject: environment === 'development' ? '[DEV] ' : '' + 'Password reset',
      text: `Hi ${updatedUser.firstName}, \n
              to reset your password please follow this link:\n
              ${resetUrl.toString()}\n
              Best, \n
              Mundwerk IT`,
      html: `Hi ${user.firstName},<br /><br />
              to reset your password please follow this link:<br /><br />
              <a href="${resetUrl.toString()}">reset password</a><br /><br />
              Best,<br /><br />
              Mundwerk IT`,
    });
  } catch (error) {
    console.error('could_not_update_user', { error });
  }
  res.status(200).json('ok');
  return;
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, newPassword, token } = req?.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // no action required if no user found with the provided email
    res.status(200).json('ok');
    return;
  }
  if (
    user.passwordResetToken !== token ||
    user.passwordResetAt < new Date(Date.now())
  ) {
    res.status(400).json('token_wrong_or_expired');
    return;
  }
  // reset password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const updatedUser = await prisma.user.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: '',
        passwordResetAt: new Date(Date.now()),
      },
    });
  } catch (error) {
    console.error('could_not_update_user');
  }
  res.status(200).json('ok');
  return;
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authenticatedUser = req.user as User;
  const { oldPassword, newPassword } = req?.body;
  const user = await prisma.user.findUnique({
    where: { uuid: authenticatedUser.uuid },
  });

  // update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      res.status(400).json('invalid_old_password');
      return;
    }
    await prisma.user.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error('could_not_update_user');
  }
  res.status(200).json('ok');
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
