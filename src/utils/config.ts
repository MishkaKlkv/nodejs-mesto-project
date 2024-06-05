import { Joi } from 'celebrate';
import rateLimit from 'express-rate-limit';

const urlRegExp = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#@!$&'()*+,;=]+\.[a-zA-Z]{2,})([a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*)#?$/;

const joiAuthorization = Joi.object().keys({
  authorization: Joi.string().required(),
}).unknown(true);

const joiObjectId = Joi.object().keys({
  cardId: Joi.string().alphanum().length(24),
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export {
  urlRegExp, joiAuthorization, joiObjectId, limiter,
};
