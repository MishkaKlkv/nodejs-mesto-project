import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import User from '../models/user';
import NotFoundError from '../error/not-found-error';
import BadRequestError from '../error/bad-request-error';
import { AuthContext } from '../types/auth-context';
import { handleErrorInvalidIdOrIdDoesNotExist, validationError } from '../middlewares/error-handler';

const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError())
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      handleErrorInvalidIdOrIdDoesNotExist(error, next, userId, 'User');
    });
};

const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send(user))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      return next(error);
    });
};

const updateUser = async (req: Request, res: Response<unknown, AuthContext>, next: NextFunction)
  : Promise<void> => {
  const { name, about } = req.body;
  const userId = res.locals.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((error) => {
      validationError(error, next);
      handleErrorInvalidIdOrIdDoesNotExist(error, next, userId, 'User');
    });
};

const updateAvatar = async (req: Request, res: Response<unknown, AuthContext>, next: NextFunction)
  : Promise<void> => {
  const { avatar } = req.body;
  const userId = res.locals.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((error) => {
      handleErrorInvalidIdOrIdDoesNotExist(error, next, userId, 'User');
    });
};

export {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
