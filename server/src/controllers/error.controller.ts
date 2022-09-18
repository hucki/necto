import { Request, Response, NextFunction } from 'express';

export const getError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.json('internal server error');
  res.status(500);
  return;
};

export const postError = getError;
export const deleteError = getError;
