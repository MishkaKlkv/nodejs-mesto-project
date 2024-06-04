import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../error/not-found-error';
import BadRequestError from '../error/bad-request-error';
import { AuthContext } from '../types/auth-context';
import { handleErrorInvalidIdOrIdDoesNotExist, validationError } from '../middlewares/error-handler';
import ConflictError from '../error/conflict-error';
import { handleAuthError } from '../middlewares/auth';

const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.user._id;
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
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(constants.HTTP_STATUS_CREATED).send(user))
      .catch((error) => {
        if (error instanceof MongooseError.ValidationError) {
          return next(new BadRequestError(error.message));
        }
        if (error.code === 11000) {
          return next(new ConflictError('Email is already in use'));
        }
        return next(error);
      }));
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

const login = async (req: Request, res: Response<unknown, AuthContext>): Promise<void> => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '25ba501a1a4b72ac4b490adf7de3b1f5ac3db595ebfb3d446be9ee8ec025bcff', { expiresIn: '7d' });
      res.send({
        token,
      });
    })
    .catch(() => {
      handleAuthError(res);
    });
};

export {
  getUsers, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
