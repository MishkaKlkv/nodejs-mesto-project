import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, updateUser, updateAvatar, getCurrentUser,
} from '../controllers/users';
import { joiAuthorization, urlRegExp } from '../utils/config';

const router = Router();

router.get('/', celebrate({
  headers: joiAuthorization,
}), getUsers);

router.patch('/me', celebrate({
  headers: joiAuthorization,
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  headers: joiAuthorization,
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp),
  }),
}), updateAvatar);

router.get('/me', celebrate({
  headers: joiAuthorization,
}), getCurrentUser);

export default router;
