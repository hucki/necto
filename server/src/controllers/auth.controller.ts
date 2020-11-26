import { Request, Response, NextFunction } from 'express';
import { AppSettings } from '../db/models/AppSettings';
import dotenv from 'dotenv';
import { OpenidRequest, OpenidResponse } from 'express-openid-connect';
dotenv.config();

/**
 * add App Settings
 *  @param {AppSettings} req.body
 */
export const isAuthenticated = (
  req: OpenidRequest,
  res: OpenidResponse,
  next: NextFunction
): void => {
  try {
    if(req.oidc.isAuthenticated()) {
      res.status(200);
      res.send();
      return;
    } else {
      res.status(401);
      res.send();
      return;
    }
  } catch(e) {
    next(e)
  }
}

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdSettings = await AppSettings.create({
      ...req.body,
    });
    res.json(createdSettings);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};