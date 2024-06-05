import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../error/unauthorized-error';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export const handleAuthError = (res: Response, next: NextFunction) => {
  next(new UnauthorizedError('Authorization required'));
};

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, '25ba501a1a4b72ac4b490adf7de3b1f5ac3db595ebfb3d446be9ee8ec025bcff');
  } catch (err) {
    return handleAuthError(res, next);
  }

  res.locals.user = payload;

  return next();
};
