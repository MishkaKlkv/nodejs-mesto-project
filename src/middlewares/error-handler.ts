import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import { CustomError } from '../error/custom-error-interface';
import NotFoundError from '../error/not-found-error';
import BadRequestError from '../error/bad-request-error';

export default (err: CustomError, req: Request, res: Response) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Internal server error' : err.message;
  res.status(statusCode).send({ message });
};

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).send({ message: 'The requested resource is not found' });
};

const handleErrorInvalidIdOrIdDoesNotExist = (
  error: unknown,
  next: NextFunction,
  documentId: string,
  documentName: string,
): void => {
  if (error instanceof MongooseError.CastError) {
    next(new BadRequestError('Invalid ID passed'));
  } else if (error instanceof NotFoundError) {
    next(new NotFoundError(`${documentName} with ID = ${documentId} doesn't exist`));
  } else {
    next(error);
  }
};

const validationError = (error: unknown, next: NextFunction): void => {
  if (error instanceof MongooseError.ValidationError) {
    next(new BadRequestError(error.message));
  } else {
    next(error);
  }
};

export {
  handleErrorInvalidIdOrIdDoesNotExist,
  validationError,
  notFoundHandler,
};
