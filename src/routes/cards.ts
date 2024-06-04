import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { joiAuthorization, joiObjectId, urlRegExp } from '../utils/config';

const router = Router();

router.get('/', celebrate({
  headers: joiAuthorization,
}), getCards);

router.post('/', celebrate({
  headers: joiAuthorization,
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegExp),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: joiObjectId,
  headers: joiAuthorization,
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: joiObjectId,
  headers: joiAuthorization,
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: joiObjectId,
  headers: joiAuthorization,
}), dislikeCard);

export default router;
