import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Card from '../models/card';
import { AuthContext } from '../types/auth-context';
import NotFoundError from '../error/not-found-error';
import { handleErrorInvalidIdOrIdDoesNotExist } from '../middlewares/error-handler';
import BadRequestError from '../error/bad-request-error';

const getCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = async (req: Request, res: Response<unknown, AuthContext>, next: NextFunction)
  : Promise<void> => {
  const { name, link } = req.body;
  const userId = res.locals.user._id;
  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      return next(error);
    });
};

const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.body;
  Card.findByIdAndDelete(cardId)
    .orFail(new NotFoundError())
    .then((card) => res.send(card))
    .catch((error) => {
      handleErrorInvalidIdOrIdDoesNotExist(error, next, cardId, 'Card');
    });
};

const likeCard = async (req: Request, res: Response<unknown, AuthContext>, next: NextFunction)
  : Promise<void> => {
  const { cardId } = req.params;
  const userId = res.locals.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(new NotFoundError())
    .then((card) => res.send(card))
    .catch((error) => {
      handleErrorInvalidIdOrIdDoesNotExist(error, next, cardId, 'Card');
    });
};

const dislikeCard = async (req: Request, res: Response<unknown, AuthContext>, next: NextFunction)
  : Promise<void> => {
  const { cardId } = req.params;
  const userId = res.locals.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(new NotFoundError())
    .then((card) => res.send(card))
    .catch((error) => {
      handleErrorInvalidIdOrIdDoesNotExist(error, next, cardId, 'Card');
    });
};

export {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
